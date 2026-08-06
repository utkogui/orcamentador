import { beforeEach, describe, expect, it, vi } from "vitest";

const reload = vi.fn();
const load = vi.fn();
const save = vi.fn();
const upsert = vi.fn();
const remove = vi.fn();

vi.mock("@/lib/matilha-knowledge/journeys", () => ({
  reloadJourneysCatalogFromDisk: (...args: unknown[]) => reload(...args),
  loadJourneysCatalog: (...args: unknown[]) => load(...args),
  saveJourneysCatalog: (...args: unknown[]) => save(...args),
  upsertJourney: (...args: unknown[]) => upsert(...args),
  removeJourney: (...args: unknown[]) => remove(...args),
}));

import { DELETE, GET, PUT } from "./route";

const catalog = {
  version: "1",
  name: "Jornadas",
  description: "",
  lastReviewed: "2026-01-01",
  journeys: [],
};

describe("GET /api/knowledge/journeys", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retorna catálogo do disco", async () => {
    reload.mockResolvedValue(catalog);
    const res = await GET();
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual(catalog);
  });

  it("faz fallback para cache em memória", async () => {
    reload.mockRejectedValue(new Error("no disk"));
    load.mockReturnValue(catalog);
    const res = await GET();
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual(catalog);
  });
});

describe("PUT /api/knowledge/journeys", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    reload.mockResolvedValue(catalog);
    upsert.mockImplementation((_c, journey) => ({
      ...catalog,
      journeys: [journey],
    }));
    save.mockResolvedValue(undefined);
  });

  it("valida e salva jornada", async () => {
    const body = {
      id: "journey_demo",
      name: "Demo",
      blockIds: ["auth_basic_login"],
      commercialBundle: true,
    };
    const res = await PUT(
      new Request("http://localhost/api/knowledge/journeys", {
        method: "PUT",
        body: JSON.stringify(body),
      })
    );
    expect(res.status).toBe(200);
    expect(save).toHaveBeenCalled();
    const json = await res.json();
    expect(json.ok).toBe(true);
    expect(json.journey.id).toBe("journey_demo");
  });

  it("retorna 400 para id inválido", async () => {
    const res = await PUT(
      new Request("http://localhost/api/knowledge/journeys", {
        method: "PUT",
        body: JSON.stringify({
          id: "INVALID-ID",
          name: "X",
          blockIds: ["a"],
          commercialBundle: false,
        }),
      })
    );
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/knowledge/journeys", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    reload.mockResolvedValue(catalog);
    remove.mockReturnValue(catalog);
    save.mockResolvedValue(undefined);
  });

  it("exige id", async () => {
    const res = await DELETE(
      new Request("http://localhost/api/knowledge/journeys", { method: "DELETE" })
    );
    expect(res.status).toBe(400);
  });

  it("remove e persiste", async () => {
    const res = await DELETE(
      new Request("http://localhost/api/knowledge/journeys?id=j1", {
        method: "DELETE",
      })
    );
    expect(res.status).toBe(200);
    expect(remove).toHaveBeenCalledWith(catalog, "j1");
    expect(save).toHaveBeenCalled();
  });
});
