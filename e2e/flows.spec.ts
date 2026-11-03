import { test, expect, type APIRequestContext } from "@playwright/test";

const WEB = process.env.WEB_URL || "http://127.0.0.1:3008";
const stamp = Date.now();
const leadName = `E2E Lead ${stamp}`;
const leadEmail = `e2e.${stamp}@test.local`;
const designTitle = `E2E Celosia ${stamp}`;

async function cleanup(request: APIRequestContext) {
  try {
    const leads = await request.get(`${WEB}/api/leads`);
    if (leads.ok()) {
      const list = await leads.json();
      for (const l of list) {
        if (l.email === leadEmail || l.name === leadName) {
          await request.delete(`${WEB}/api/leads/${l._id}`);
        }
      }
    }
    const designs = await request.get(`${WEB}/api/designs`);
    if (designs.ok()) {
      const list = await designs.json();
      for (const d of list) {
        if (d.title === designTitle) {
          await request.delete(`${WEB}/api/designs/${d._id}`);
        }
      }
    }
  } catch {
    /* best-effort */
  }
}

test.afterEach(async ({ request }) => {
  await cleanup(request);
});

test("home muestra marca ARGA y CTAs", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "ARGA" })).toBeVisible();
  await expect(page.getByRole("link", { name: /celosías/i }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /información/i })).toBeVisible();
});

test("contacto crea lead y aparece en CRM", async ({ page }) => {
  await page.goto("/contacto");
  await page.getByLabel(/nombre/i).fill(leadName);
  await page.getByLabel(/email/i).fill(leadEmail);
  await page.getByLabel(/teléfono/i).fill("5512345678");
  await page.getByLabel(/mensaje/i).fill("Prueba funcional Playwright");
  await page.getByRole("button", { name: /enviar/i }).click();
  await expect(page.getByText(/recibido/i)).toBeVisible();

  await page.goto("/crm");
  await expect(page.getByRole("heading", { name: /clientes potenciales/i })).toBeVisible();
  await page.getByLabel(/buscar leads/i).fill(leadEmail);
  await expect(page.getByText(leadName)).toBeVisible();
  await page.getByText(leadName).click();
  await page.locator("aside select").selectOption("contactado");
  await expect(page.locator("aside select")).toHaveValue("contactado");
});

test("admin crea diseño y se ve en celosías", async ({ page }) => {
  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: /administración de diseños/i })).toBeVisible();

  await page.locator('input[required]').fill(designTitle);
  await page.locator("textarea").first().fill("Diseño de prueba E2E");
  await page.getByRole("button", { name: /^crear$/i }).click();
  await expect(page.getByRole("heading", { name: designTitle })).toBeVisible();

  await page.goto("/celosias");
  await expect(page.getByRole("heading", { name: "Celosías" })).toBeVisible();
  await expect(page.getByRole("heading", { name: designTitle })).toBeVisible();
});

test("navegación móvil abre menú", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: /menú/i }).click();
  await expect(page.getByRole("link", { name: "Contacto" }).last()).toBeVisible();
  await page.getByRole("link", { name: "Contacto" }).last().click();
  await expect(page).toHaveURL(/contacto/);
});
