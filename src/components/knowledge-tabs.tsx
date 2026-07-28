"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BuildingBlockDetailModal } from "@/components/building-block-detail-modal";
import { JourneyComposer } from "@/components/journey-composer";
import type { BuildingBlock } from "@/types/building-blocks";
import type { BuildingBlockDesignProfile, DesignLibrary } from "@/lib/matilha-knowledge/design-intelligence";
import {
  EFFORT_SOURCE_RELIABILITY_LABELS,
  EFFORT_SOURCE_TYPE_LABELS,
  getEffortSourcesForBlock,
  type EffortSource,
} from "@/lib/matilha-knowledge/effort-sources";
import type { BuildingBlockJourney } from "@/lib/matilha-knowledge/journeys";
import {
  ENGINEERING_DIFFICULTY_LABELS,
  ENGINEERING_DISCIPLINE_LABELS,
  type EngineeringBlock,
  type EngineeringDifficulty,
  type EngineeringDiscipline,
} from "@/lib/matilha-knowledge/engineering/engineering-types";

type Props = {
  buildingBlocks: BuildingBlock[];
  engineeringBlocks: EngineeringBlock[];
  designProfiles: Record<string, BuildingBlockDesignProfile>;
  designLibraries: Record<string, DesignLibrary>;
  effortSources: EffortSource[];
  journeys: BuildingBlockJourney[];
};

function TabIntro({
  title,
  purpose,
  howItWorks,
  note,
}: {
  title: string;
  purpose: string;
  howItWorks: string[];
  note?: string;
}) {
  return (
    <div className="rounded-xl border bg-muted/30 p-4 sm:p-5">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{purpose}</p>
      <ol className="mt-3 list-decimal space-y-1.5 pl-4 text-sm text-muted-foreground">
        {howItWorks.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      {note ? <p className="mt-3 text-xs text-muted-foreground/90">{note}</p> : null}
    </div>
  );
}

function disciplineLabel(key: string): string {
  return ENGINEERING_DISCIPLINE_LABELS[key as EngineeringDiscipline] ?? key;
}

function difficultyLabel(value: EngineeringDifficulty): string {
  return ENGINEERING_DIFFICULTY_LABELS[value] ?? value;
}

export function KnowledgeTabs({
  buildingBlocks,
  engineeringBlocks,
  designProfiles,
  designLibraries,
  effortSources,
  journeys,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<BuildingBlock | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("building-blocks");
  const [focusJourneyId, setFocusJourneyId] = useState<string | null>(null);
  const [journeysState, setJourneysState] = useState(journeys);

  function openBlock(block: BuildingBlock) {
    setSelectedBlock(block);
    setModalOpen(true);
  }

  function openJourney(journeyId: string) {
    setFocusJourneyId(journeyId);
    setActiveTab("journeys");
    setModalOpen(false);
  }

  const journeysByBlock = useMemo(() => {
    const map = new Map<string, BuildingBlockJourney[]>();
    for (const journey of journeysState) {
      for (const blockId of journey.blockIds) {
        const list = map.get(blockId) ?? [];
        list.push(journey);
        map.set(blockId, list);
      }
    }
    return map;
  }, [journeysState]);

  const term = searchTerm.toLowerCase();

  const filteredBuildingBlocks = buildingBlocks.filter(
    (block) =>
      block.name.toLowerCase().includes(term) ||
      block.id.toLowerCase().includes(term) ||
      block.category_name.toLowerCase().includes(term)
  );

  const filteredEngineeringBlocks = engineeringBlocks.filter(
    (block) =>
      (block.name || "").toLowerCase().includes(term) || block.id.toLowerCase().includes(term)
  );

  const filteredDesignProfiles = Object.values(designProfiles).filter((profile) => {
    const bb = buildingBlocks.find((b) => b.id === profile.id);
    return (
      profile.id.toLowerCase().includes(term) || (bb?.name || "").toLowerCase().includes(term)
    );
  });

  const filteredEffortSources = effortSources.filter(
    (source) =>
      source.title.toLowerCase().includes(term) ||
      source.shortTitle.toLowerCase().includes(term) ||
      source.publisher.toLowerCase().includes(term) ||
      source.tags?.some((t) => t.toLowerCase().includes(term)) ||
      EFFORT_SOURCE_TYPE_LABELS[source.type].toLowerCase().includes(term)
  );

  const searchPlaceholder =
    activeTab === "engineering"
      ? "Buscar perfil de engenharia por nome ou id..."
      : activeTab === "design"
        ? "Buscar padrão de design por bloco..."
        : activeTab === "sources"
          ? "Buscar fonte por nome, editor ou tag..."
          : "Buscar Building Block por nome, id ou categoria...";

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          setSearchTerm("");
        }}
        className="w-full"
      >
        <TabsList className="mb-4 h-auto flex-wrap">
          <TabsTrigger value="building-blocks">Building Blocks</TabsTrigger>
          <TabsTrigger value="journeys">Jornadas</TabsTrigger>
          <TabsTrigger value="engineering">Engenharia (horas)</TabsTrigger>
          <TabsTrigger value="design">Design reutilizável</TabsTrigger>
          <TabsTrigger value="sources">Fontes de esforço</TabsTrigger>
          <TabsTrigger value="shadow-mode">Calibração (Shadow)</TabsTrigger>
        </TabsList>

        {activeTab !== "shadow-mode" && activeTab !== "journeys" && (
          <div className="relative mb-6">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        <TabsContent value="building-blocks" className="space-y-4">
          <TabIntro
            title="O que é esta aba?"
            purpose="Catálogo comercial do que a Matilha vende: escopo, telas, o que inclui e o que fica de fora."
            howItWorks={[
              "Cada card é um Building Block (ex.: login, CRUD, dashboard).",
              "Clique no card para ver os diagramas UML (atividade e estados), status e feedbacks.",
              "Essa é a base usada no briefing/IA para montar a estimativa.",
            ]}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBuildingBlocks.map((block) => {
              const blockJourneys = journeysByBlock.get(block.id) ?? [];
              return (
              <Card
                key={block.id}
                role="button"
                tabIndex={0}
                onClick={() => openBlock(block)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openBlock(block);
                  }
                }}
                className="flex cursor-pointer flex-col transition-colors hover:border-primary/40 hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <CardHeader className="pb-3">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <Badge variant="outline" className="text-xs">
                      {block.category_name}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">{block.id}</span>
                  </div>
                  <CardTitle className="text-lg">{block.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{block.summary}</CardDescription>
                  {blockJourneys.length > 0 ? (
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-[10px] font-normal">
                        Em {blockJourneys.length} jornada
                        {blockJourneys.length === 1 ? "" : "s"}
                      </Badge>
                    </div>
                  ) : null}
                </CardHeader>
                <CardContent className="mt-auto space-y-3 pt-0 text-sm">
                  <div>
                    <p className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Inclui
                    </p>
                    <ul className="list-disc space-y-0.5 pl-4 text-muted-foreground">
                      {block.includes.slice(0, 3).map((item, i) => (
                        <li key={i} className="line-clamp-1">
                          {item}
                        </li>
                      ))}
                      {block.includes.length > 3 && (
                        <li className="list-none text-xs text-muted-foreground/80">
                          +{block.includes.length - 3} itens
                        </li>
                      )}
                    </ul>
                  </div>
                  {(block.pages?.length ?? 0) > 0 && (
                    <div className="border-t pt-2 text-xs font-medium text-primary">
                      Ver UML de {block.pages.length} tela
                      {block.pages.length === 1 ? "" : "s"} →
                    </div>
                  )}
                </CardContent>
              </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="journeys" className="space-y-4">
          <TabIntro
            title="Para que servem as Jornadas?"
            purpose="Encadeie Building Blocks em ordem de usuário (ex.: login → dashboard → CMS) e marque se formam um pacote comercial."
            howItWorks={[
              "Adicione blocos na ordem desejada e reordene com as setas.",
              "Ative Pacote comercial quando costumam ser vendidos juntos.",
              "Veja o UML composto e salve a jornada para reutilizar.",
              "Nos cards de Building Blocks aparece em quantas jornadas o bloco entra.",
            ]}
          />
          <JourneyComposer
            key={focusJourneyId ?? "journeys-root"}
            buildingBlocks={buildingBlocks}
            initialJourneys={journeysState}
            focusJourneyId={focusJourneyId}
            onOpenBlock={openBlock}
            onJourneysChange={setJourneysState}
          />
        </TabsContent>

        <TabsContent value="engineering" className="space-y-4">
          <TabIntro
            title="Para que serve a Engenharia?"
            purpose="Aqui não está o “o que entregamos”, e sim o esforço técnico por disciplina: horas base de UX, UI, front, back, QA etc. para cada Building Block."
            howItWorks={[
              "Cada card espelha um Building Block, com perfil de horas.",
              "Dificuldade, reuso e risco ajustam o custo real na Engineering Engine.",
              "Dependências puxam outros blocos automaticamente (ex.: login → recuperação de senha).",
              "Esses números alimentam o Shadow Mode e, no futuro, podem substituir o motor oficial.",
            ]}
            note="Leitura: horas base = esforço típico. Reuso alto barateia repetição. Risco alto aumenta buffer."
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEngineeringBlocks.map((block) => {
              const totalHours = Object.values(block.engineeringProfile).reduce(
                (a, b) => a + (b ?? 0),
                0
              );
              const linkedSources = getEffortSourcesForBlock(block.id, block.categoryId).slice(0, 4);

              return (
                <Card key={block.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <Badge variant="secondary">{difficultyLabel(block.difficulty)}</Badge>
                      <span className="font-mono text-xs text-muted-foreground">{block.id}</span>
                    </div>
                    <CardTitle className="text-lg">{block.name || block.id}</CardTitle>
                    <CardDescription>
                      Perfil de esforço técnico deste bloco (não é o escopo comercial).
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto space-y-3 pt-0 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg border bg-muted/40 px-3 py-2">
                        <p className="text-[11px] text-muted-foreground">Reuso</p>
                        <p className="font-semibold">{Math.round(block.reuseFactor * 100)}%</p>
                        <p className="text-[10px] text-muted-foreground">quanto dá para aproveitar</p>
                      </div>
                      <div className="rounded-lg border bg-muted/40 px-3 py-2">
                        <p className="text-[11px] text-muted-foreground">Risco</p>
                        <p className="font-semibold">{Math.round((block.riskFactor || 0) * 100)}%</p>
                        <p className="text-[10px] text-muted-foreground">buffer de incerteza</p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Horas base · {totalHours}h no total
                      </p>
                      <div className="mt-2 space-y-1">
                        {Object.entries(block.engineeringProfile).map(([discipline, hours]) => (
                          <div key={discipline} className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                              {disciplineLabel(discipline)}
                            </span>
                            <span className="font-medium tabular-nums">{hours}h</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {linkedSources.length > 0 && (
                      <div>
                        <p className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                          Fontes que ancoram
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {linkedSources.map((s) => (
                            <Badge key={s.id} variant="outline" className="text-xs font-normal">
                              {s.shortTitle}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {block.stackTags && block.stackTags.length > 0 && (
                      <div>
                        <p className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                          Stack (modificadores)
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {block.stackTags.map((t) => (
                            <Badge key={t} variant="outline" className="text-xs font-normal">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {block.dependencies && block.dependencies.length > 0 && (
                      <div>
                        <p className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                          Puxa automaticamente
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {block.dependencies.map((d) => (
                            <Badge key={d} variant="secondary" className="font-mono text-xs font-normal">
                              {d}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="design" className="space-y-4">
          <TabIntro
            title="Para que serve o Design reutilizável?"
            purpose="Indica quando um Building Block pode usar um padrão pronto (ex.: bloco do shadcn) em vez de desenhar do zero — e quanto isso pode reduzir UI/Frontend."
            howItWorks={[
              "Cada card liga um Building Block a um padrão de biblioteca.",
              "A referência (ex.: login-01) é o componente/bloco sugerido.",
              "Os % são impacto estimado de economia, não desconto automático no preço.",
              "Na estimativa, essas sugestões aparecem como Design Intelligence para o time.",
            ]}
            note="Hoje isso é orientação de implementação. As reduções ainda não entram sozinhas no cálculo oficial."
          />

          {filteredDesignProfiles.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Nenhum padrão cadastrado para a busca atual.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredDesignProfiles.map((profile) => {
                const bb = buildingBlocks.find((b) => b.id === profile.id);

                return (
                  <Card key={profile.id} className="flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <Badge variant="outline">Padrão pronto</Badge>
                        <span className="font-mono text-xs text-muted-foreground">{profile.id}</span>
                      </div>
                      <CardTitle className="text-lg">{bb?.name || profile.id}</CardTitle>
                      <CardDescription>
                        Em vez de criar do zero, o time pode partir deste padrão.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto space-y-3 pt-0 text-sm">
                      {profile.patterns.map((pattern, idx) => {
                        const library = designLibraries[pattern.library];
                        return (
                          <div key={idx} className="space-y-2 rounded-md bg-muted/50 p-3">
                            <div className="flex items-center justify-between gap-2">
                              <Badge variant="outline" className="bg-background">
                                {library?.name || pattern.library}
                              </Badge>
                              <span className="font-mono text-xs">{pattern.reference}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{pattern.description}</p>
                            {library?.url ? (
                              <a
                                href={library.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-medium text-primary hover:underline"
                              >
                                Ver biblioteca →
                              </a>
                            ) : null}
                            <div className="flex flex-wrap gap-2 border-t pt-2">
                              {pattern.uiReduction > 0 && (
                                <Badge variant="secondary" className="text-xs font-normal">
                                  UI até -{Math.round(pattern.uiReduction * 100)}%
                                </Badge>
                              )}
                              {pattern.frontendReduction > 0 && (
                                <Badge variant="secondary" className="text-xs font-normal">
                                  Front até -{Math.round(pattern.frontendReduction * 100)}%
                                </Badge>
                              )}
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              Economia estimada se o padrão for adotado de fato.
                            </p>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <TabIntro
            title="Para que servem as fontes de esforço?"
            purpose="São as referências que usamos para não chutar horas: benchmarks internacionais, modelos paramétricos, catálogos de atividade e práticas de mercado BR."
            howItWorks={[
              "Cada fonte explica o que mede e como a Matilha usa na calibração.",
              "Métricas-chave (PDR, h/tela, mix de disciplinas) ficam visíveis para consulta.",
              "Os cards de Engenharia mostram quais fontes ancoram cada Building Block.",
              "O próximo passo é preencher a fonte interna com horas reais dos projetos Matilha.",
            ]}
            note={`${effortSources.length} fontes cadastradas. Confiabilidade alta = padrão/base larga; exploratória = orientação, não âncora única.`}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            {filteredEffortSources.map((source) => (
              <Card key={source.id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{EFFORT_SOURCE_TYPE_LABELS[source.type]}</Badge>
                    <Badge variant="secondary">
                      Confiabilidade {EFFORT_SOURCE_RELIABILITY_LABELS[source.reliability]}
                    </Badge>
                    {source.year ? (
                      <span className="text-xs text-muted-foreground">{source.year}</span>
                    ) : null}
                  </div>
                  <CardTitle className="text-lg">{source.title}</CardTitle>
                  <CardDescription>
                    {source.publisher}
                    {source.language === "pt" ? " · PT" : " · EN"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto space-y-3 pt-0 text-sm">
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      O que entrega
                    </p>
                    <p className="mt-1 text-muted-foreground">{source.whatItGives}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Como usamos
                    </p>
                    <p className="mt-1 text-muted-foreground">{source.howWeUseIt}</p>
                  </div>

                  {source.metrics && source.metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {source.metrics.map((metric) => (
                        <div
                          key={`${source.id}-${metric.label}`}
                          className="rounded-lg border bg-muted/40 px-3 py-2"
                        >
                          <p className="text-[11px] text-muted-foreground">{metric.label}</p>
                          <p className="font-semibold tabular-nums">
                            {metric.value}
                            {metric.unit ? (
                              <span className="ml-1 text-xs font-normal text-muted-foreground">
                                {metric.unit}
                              </span>
                            ) : null}
                          </p>
                          {metric.note ? (
                            <p className="mt-0.5 text-[10px] text-muted-foreground">{metric.note}</p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <p className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Takeaways
                    </p>
                    <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
                      {source.keyTakeaways.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {source.url ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-sm font-medium text-primary hover:underline"
                    >
                      Abrir fonte →
                    </a>
                  ) : (
                    <p className="text-xs text-muted-foreground">Sem URL pública (fonte interna).</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shadow-mode" className="space-y-4">
          <TabIntro
            title="Para que serve a Calibração (Shadow Mode)?"
            purpose="Compara, em paralelo, o preço/horas do motor oficial da estimativa com o que a Engineering Engine calcularia para os mesmos Building Blocks — sem mudar o valor cobrado."
            howItWorks={[
              "Você cria uma estimativa via IA/Briefing (com Building Blocks de origem).",
              "No resultado, o Shadow Mode calcula de novo usando os perfis da aba Engenharia.",
              "Mostra diferença de horas e preço: oficial vs. Engineering Engine.",
              "Use a aba Fontes de esforço para entender de onde vêm as âncoras de calibração.",
              "Serve para calibrar a base antes de migrar o motor oficial.",
            ]}
            note="Não altera proposta, PDF nem preço oficial. É só leitura para validação interna."
          />

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Estimativa oficial",
                text: "O motor atual gera horas e preço como hoje.",
              },
              {
                step: "2",
                title: "Engineering Engine",
                text: "Recalcula o mesmo escopo com horas por disciplina desta Knowledge.",
              },
              {
                step: "3",
                title: "Comparativo",
                text: "Você vê o desvio (%) para ajustar perfis, risco e reuso.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border bg-background px-4 py-3">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Passo {item.step}
                </p>
                <p className="mt-1 font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Onde ver na prática</CardTitle>
              <CardDescription>
                O Shadow Mode só aparece no resultado de estimativas que nasceram de Building
                Blocks (fluxo de IA / briefing).
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Link href="/estimates" className="text-sm font-medium text-primary hover:underline">
                Ver estimativas recentes →
              </Link>
              <Link
                href="/estimates/new/ai"
                className="text-sm font-medium text-primary hover:underline"
              >
                Criar estimativa via IA →
              </Link>
              <button
                type="button"
                className="text-sm font-medium text-muted-foreground hover:underline"
                onClick={() => setActiveTab("engineering")}
              >
                Revisar horas de engenharia →
              </button>
              <button
                type="button"
                className="text-sm font-medium text-muted-foreground hover:underline"
                onClick={() => setActiveTab("sources")}
              >
                Ver fontes de esforço →
              </button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BuildingBlockDetailModal
        block={selectedBlock}
        open={modalOpen}
        onOpenChange={setModalOpen}
        journeys={selectedBlock ? journeysByBlock.get(selectedBlock.id) ?? [] : []}
        onOpenJourney={openJourney}
      />
    </>
  );
}
