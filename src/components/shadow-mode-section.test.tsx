/** @vitest-environment jsdom */
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ShadowModeSection } from "./shadow-mode-section";
import type { ShadowResult } from "@/lib/engineering-validation/shadow-types";

describe("ShadowModeSection", () => {
  it("mostra motivo quando indisponível", () => {
    render(
      <ShadowModeSection
        shadow={{ available: false, reason: "Sem Building Blocks" }}
      />
    );
    expect(screen.getByText("Sem Building Blocks")).toBeInTheDocument();
  });

  it("mostra comparação quando disponível", () => {
    const shadow: ShadowResult = {
      available: true,
      status: "aligned",
      price: {
        official: 100_000,
        engineering: 95_000,
        diffAbs: -5_000,
        diffPct: -0.05,
      },
      hours: {
        official: 200,
        engineering: 190,
        diffAbs: -10,
        diffPct: -0.05,
      },
      marginPct: 30,
      disciplineHours: [{ discipline: "frontend", label: "Frontend", hours: 100 }],
      topBlocks: [
        {
          blockId: "auth_basic_login",
          blockName: "Login",
          difficulty: "commodity",
          finalHours: 20,
          cost: 4000,
          addedAsDependency: false,
        },
      ],
      sourceBlockIds: ["auth_basic_login"],
      addedDependencyIds: [],
      missingBlockIds: [],
    };

    render(<ShadowModeSection shadow={shadow} />);
    expect(screen.getByText("Alinhado")).toBeInTheDocument();
    expect(screen.getByText("Preço oficial")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});
