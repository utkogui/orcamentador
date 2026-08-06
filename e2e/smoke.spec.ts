import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("home carrega e navega para estimativas", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /Estime projetos digitais/i })
    ).toBeVisible();

    await page.getByRole("link", { name: "Ver estimativas" }).first().click();
    await expect(page).toHaveURL(/\/estimates/);
    await expect(page.getByRole("heading", { name: "Estimativas" })).toBeVisible();
  });

  test("knowledge abre com abas", async ({ page }) => {
    await page.goto("/knowledge");
    await expect(
      page.getByRole("heading", { name: "Matilha Knowledge" })
    ).toBeVisible();
    await expect(page.getByRole("tab", { name: "Building Blocks" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Jornadas" })).toBeVisible();

    await page.getByRole("tab", { name: "Jornadas" }).click();
    await expect(page.getByRole("tab", { name: "Jornadas" })).toHaveAttribute(
      "data-state",
      "active"
    );
  });
});
