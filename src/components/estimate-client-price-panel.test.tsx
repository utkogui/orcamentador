/** @vitest-environment jsdom */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

vi.mock("@/app/actions", () => ({
  saveClientProposalPrice: vi.fn(),
}));

import { saveClientProposalPrice } from "@/app/actions";
import { EstimateClientPricePanel } from "./estimate-client-price-panel";

const savePrice = saveClientProposalPrice as ReturnType<typeof vi.fn>;

describe("EstimateClientPricePanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    savePrice.mockResolvedValue(undefined);
  });

  it("mostra preview do preço sugerido e salva escolha", async () => {
    const user = userEvent.setup();
    render(
      <EstimateClientPricePanel
        estimateId="e1"
        suggestedPrice={100_000}
        commercialMin={90_000}
        commercialMax={110_000}
        savedMode={null}
        savedPrice={null}
      />
    );

    expect(screen.getByText("Preço para o cliente")).toBeInTheDocument();
    expect(screen.getByText("Preço sugerido")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Salvar escolha" }));
    expect(savePrice).toHaveBeenCalledWith(
      "e1",
      expect.objectContaining({ mode: "suggested", redirectToResult: false })
    );
  });
});
