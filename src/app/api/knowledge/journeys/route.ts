import { NextResponse } from "next/server";
import { z } from "zod";
import {
  loadJourneysCatalog,
  reloadJourneysCatalogFromDisk,
  removeJourney,
  saveJourneysCatalog,
  upsertJourney,
} from "@/lib/matilha-knowledge/journeys";

const journeySchema = z.object({
  id: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9_]+$/, "id deve ser snake_case (a-z, 0-9, _)"),
  name: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  blockIds: z.array(z.string().min(1)).min(1),
  commercialBundle: z.boolean(),
  notes: z.string().max(1000).optional(),
});

export async function GET() {
  try {
    const catalog = await reloadJourneysCatalogFromDisk().catch(() => loadJourneysCatalog());
    return NextResponse.json(catalog);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao ler jornadas" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const journey = journeySchema.parse(body);
    const catalog = await reloadJourneysCatalogFromDisk().catch(() => loadJourneysCatalog());
    const next = upsertJourney(catalog, journey);
    await saveJourneysCatalog(next);
    return NextResponse.json({ ok: true, journey, catalog: next });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao salvar jornada" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
    }
    const catalog = await reloadJourneysCatalogFromDisk().catch(() => loadJourneysCatalog());
    const next = removeJourney(catalog, id);
    await saveJourneysCatalog(next);
    return NextResponse.json({ ok: true, catalog: next });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao excluir jornada" },
      { status: 500 }
    );
  }
}
