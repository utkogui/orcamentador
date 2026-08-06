import { expect, test } from "@playwright/test";

test.describe("estimativa manual", () => {
  test("cria estimativa e abre detalhe", async ({ page }) => {
    const name = `E2E Estimativa ${Date.now()}`;

    await page.goto("/estimates/new");
    await expect(page.getByRole("heading", { name: "Nova estimativa" })).toBeVisible();

    await page.getByLabel("Nome da estimativa").fill(name);
    await page.getByLabel("Cliente").fill("Cliente E2E");
    await page.getByLabel("Descrição").fill("Criada pelo Playwright");
    await page.getByLabel("Margem (%)").fill("30");

    await page.getByRole("button", { name: "Criar estimativa" }).click();

    await expect(page).toHaveURL(/\/estimates\/[^/]+$/);
    await expect(page.getByRole("heading", { name })).toBeVisible();
    await expect(page.getByText(/Cliente E2E/)).toBeVisible();
    await expect(page.getByText("Preço para o cliente")).toBeVisible();
  });
});
