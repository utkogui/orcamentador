import { describe, expect, it } from "vitest";
import {
  getAllEffortSources,
  getEffortSourceById,
  getEffortSourcesByType,
  getEffortSourcesForBlock,
} from "./effort-sources-loader";

describe("effort-sources-loader", () => {
  it("carrega catálogo e busca por id", () => {
    expect(getAllEffortSources().length).toBeGreaterThan(0);
    expect(getEffortSourceById("isbsg_de")?.shortTitle).toBe("ISBSG");
  });

  it("filtra por tipo", () => {
    const benchmarks = getEffortSourcesByType("benchmark_db");
    expect(benchmarks.some((s) => s.id === "isbsg_de")).toBe(true);
  });

  it("resolve fontes ligadas a bloco/categoria", () => {
    const sources = getEffortSourcesForBlock("auth_basic_login", "authentication");
    expect(Array.isArray(sources)).toBe(true);
  });
});
