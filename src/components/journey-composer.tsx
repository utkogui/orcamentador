"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UmlJourneyDiagram } from "@/components/uml-journey-diagram";
import { generateApplicationFlowFromJourney } from "@/lib/application-flow/generate-from-journey";
import type { BuildingBlockJourney } from "@/lib/matilha-knowledge/journeys";
import type { BuildingBlock } from "@/types/building-blocks";

type Props = {
  buildingBlocks: BuildingBlock[];
  initialJourneys: BuildingBlockJourney[];
  focusJourneyId?: string | null;
  onOpenBlock?: (block: BuildingBlock) => void;
  onJourneysChange?: (journeys: BuildingBlockJourney[]) => void;
};

function slugify(name: string): string {
  return `journey_${name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 60)}`;
}

function emptyDraft() {
  return {
    name: "",
    description: "",
    notes: "",
    commercialBundle: true,
    blockIds: [] as string[],
    editingId: null as string | null,
    selectedId: null as string | null,
  };
}

export function JourneyComposer({
  buildingBlocks,
  initialJourneys,
  focusJourneyId,
  onOpenBlock,
  onJourneysChange,
}: Props) {
  const [journeys, setJourneys] = useState(initialJourneys);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [commercialBundle, setCommercialBundle] = useState(true);
  const [blockIds, setBlockIds] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pickerTerm, setPickerTerm] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const blockById = useMemo(
    () => new Map(buildingBlocks.map((b) => [b.id, b])),
    [buildingBlocks]
  );

  function applyJourney(journey: BuildingBlockJourney) {
    setSelectedId(journey.id);
    setEditingId(journey.id);
    setName(journey.name);
    setDescription(journey.description ?? "");
    setNotes(journey.notes ?? "");
    setCommercialBundle(journey.commercialBundle);
    setBlockIds([...journey.blockIds]);
    setMessage(null);
  }

  useEffect(() => {
    const targetId = focusJourneyId ?? journeys[0]?.id ?? null;
    if (!targetId) {
      const draft = emptyDraft();
      setSelectedId(draft.selectedId);
      setEditingId(draft.editingId);
      setName(draft.name);
      setDescription(draft.description);
      setNotes(draft.notes);
      setCommercialBundle(draft.commercialBundle);
      setBlockIds(draft.blockIds);
      return;
    }
    const journey = journeys.find((j) => j.id === targetId);
    if (journey) applyJourney(journey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to focus / initial list identity
  }, [focusJourneyId]);

  function startNew() {
    const draft = emptyDraft();
    setSelectedId(draft.selectedId);
    setEditingId(draft.editingId);
    setName(draft.name);
    setDescription(draft.description);
    setNotes(draft.notes);
    setCommercialBundle(draft.commercialBundle);
    setBlockIds(draft.blockIds);
    setMessage(null);
  }

  function addBlock(id: string) {
    setBlockIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function removeBlock(id: string) {
    setBlockIds((prev) => prev.filter((x) => x !== id));
  }

  function moveBlock(id: string, dir: -1 | 1) {
    setBlockIds((prev) => {
      const idx = prev.indexOf(id);
      if (idx < 0) return prev;
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      return copy;
    });
  }

  const orderedBlocks = useMemo(
    () =>
      blockIds
        .map((id) => blockById.get(id))
        .filter((b): b is BuildingBlock => Boolean(b)),
    [blockIds, blockById]
  );

  const flow = useMemo(() => {
    if (orderedBlocks.length === 0) return null;
    return generateApplicationFlowFromJourney(orderedBlocks, {
      title: name.trim() || "Jornada em edição",
      summary: description.trim() || undefined,
      commercialBundle,
    });
  }, [orderedBlocks, name, description, commercialBundle]);

  const pickerResults = useMemo(() => {
    const term = pickerTerm.toLowerCase();
    return buildingBlocks
      .filter(
        (b) =>
          !blockIds.includes(b.id) &&
          (b.name.toLowerCase().includes(term) ||
            b.id.toLowerCase().includes(term) ||
            b.category_name.toLowerCase().includes(term))
      )
      .slice(0, 12);
  }, [buildingBlocks, blockIds, pickerTerm]);

  async function saveJourney() {
    if (!name.trim()) {
      setMessage("Informe um nome para a jornada.");
      return;
    }
    if (blockIds.length === 0) {
      setMessage("Adicione pelo menos um Building Block.");
      return;
    }

    const id = editingId ?? slugify(name);
    const payload: BuildingBlockJourney = {
      id,
      name: name.trim(),
      description: description.trim() || undefined,
      blockIds,
      commercialBundle,
      notes: notes.trim() || undefined,
    };

    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/knowledge/journeys", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Não foi possível salvar."
        );
      }
      setJourneys(data.catalog.journeys);
      onJourneysChange?.(data.catalog.journeys);
      setEditingId(payload.id);
      setSelectedId(payload.id);
      setMessage("Jornada salva.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteJourney(id: string) {
    if (!confirm("Excluir esta jornada?")) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/knowledge/journeys?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Não foi possível excluir."
        );
      }
      setJourneys(data.catalog.journeys);
      onJourneysChange?.(data.catalog.journeys);
      if (editingId === id) startNew();
      setMessage("Jornada excluída.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Erro ao excluir.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold">Jornadas salvas</h4>
          <Button type="button" size="sm" variant="outline" onClick={startNew}>
            Nova
          </Button>
        </div>
        <div className="space-y-2">
          {journeys.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma jornada ainda.</p>
          ) : (
            journeys.map((journey) => (
              <button
                key={journey.id}
                type="button"
                onClick={() => applyJourney(journey)}
                className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${
                  selectedId === journey.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/40"
                }`}
              >
                <p className="text-sm font-medium">{journey.name}</p>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                  {journey.blockIds.join(" → ")}
                </p>
                {journey.commercialBundle ? (
                  <Badge variant="secondary" className="mt-1 text-[10px]">
                    Pacote comercial
                  </Badge>
                ) : null}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {editingId ? "Editar jornada" : "Nova jornada"}
            </CardTitle>
            <CardDescription>
              Monte a sequência (ex.: login → dashboard → CMS), marque se é pacote comercial e
              salve para reutilizar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Nome
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="SaaS com conteúdo"
                />
              </div>
              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={commercialBundle}
                    onChange={(e) => setCommercialBundle(e.target.checked)}
                    className="h-4 w-4 rounded border"
                  />
                  Pacote comercial (costumam ser vendidos juntos)
                </label>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Descrição
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jornada do usuário após autenticação…"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Notas internas
              </label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Opcional"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Cadeia ({blockIds.length} blocos)
              </p>
              {orderedBlocks.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Adicione Building Blocks abaixo.
                </p>
              ) : (
                <ol className="space-y-2">
                  {orderedBlocks.map((block, index) => (
                    <li
                      key={block.id}
                      className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2"
                    >
                      <span className="w-6 text-xs font-semibold text-muted-foreground">
                        {index + 1}.
                      </span>
                      <div className="min-w-0 flex-1">
                        <button
                          type="button"
                          className="truncate text-left text-sm font-medium hover:underline"
                          onClick={() => onOpenBlock?.(block)}
                        >
                          {block.name}
                        </button>
                        <p className="truncate font-mono text-[10px] text-muted-foreground">
                          {block.id}
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => moveBlock(block.id, -1)}
                        disabled={index === 0}
                        aria-label="Subir"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => moveBlock(block.id, 1)}
                        disabled={index === orderedBlocks.length - 1}
                        aria-label="Descer"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600"
                        onClick={() => removeBlock(block.id)}
                        aria-label="Remover"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div className="space-y-2 rounded-lg border p-3">
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Adicionar Building Block
              </p>
              <Input
                value={pickerTerm}
                onChange={(e) => setPickerTerm(e.target.value)}
                placeholder="Buscar por nome, id ou categoria…"
              />
              <div className="flex flex-wrap gap-2">
                {pickerResults.map((block) => (
                  <Button
                    key={block.id}
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => addBlock(block.id)}
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    {block.name}
                  </Button>
                ))}
                {pickerResults.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Nenhum bloco encontrado.</p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" onClick={() => void saveJourney()} disabled={saving}>
                {saving ? "Salvando…" : editingId ? "Atualizar jornada" : "Salvar jornada"}
              </Button>
              {editingId ? (
                <Button
                  type="button"
                  variant="destructive"
                  disabled={saving}
                  onClick={() => void deleteJourney(editingId)}
                >
                  Excluir
                </Button>
              ) : null}
              {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
            </div>
          </CardContent>
        </Card>

        {flow ? (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">UML da jornada composta</CardTitle>
              <CardDescription>
                {commercialBundle
                  ? "Telas e ações de cada bloco, unidas nas junções reais (pacote comercial)."
                  : "Telas e ações de cada bloco, unidas nas junções reais da jornada."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UmlJourneyDiagram flow={flow} />
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
