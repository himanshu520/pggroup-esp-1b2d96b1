import { test, expect, type BrowserContext, type Page } from "@playwright/test";

/**
 * Verifies brand-logo animations are disabled when prefers-reduced-motion is on
 * and that no layout shift/flicker occurs on refresh (space is reserved).
 *
 * Covers public pages (/employee/login, /auth) and the authenticated employee
 * dashboard (/employee) when a Supabase session is injected by the harness.
 */

const PUBLIC_PAGES = ["/employee/login", "/auth"] as const;
const DASHBOARD_PATH = "/employee";

const {
  LOVABLE_BROWSER_AUTH_STATUS,
  LOVABLE_BROWSER_SUPABASE_STORAGE_KEY,
  LOVABLE_BROWSER_SUPABASE_SESSION_JSON,
  LOVABLE_BROWSER_SUPABASE_COOKIES_JSON,
} = process.env;

const HAS_SESSION = LOVABLE_BROWSER_AUTH_STATUS === "injected";

async function restoreSupabaseSession(context: BrowserContext, page: Page, origin: string) {
  if (LOVABLE_BROWSER_SUPABASE_COOKIES_JSON) {
    const cookies = JSON.parse(LOVABLE_BROWSER_SUPABASE_COOKIES_JSON).map(
      (c: Record<string, unknown>) => ({ ...c, url: origin }),
    );
    await context.addCookies(cookies);
  }
  await page.goto(origin);
  if (LOVABLE_BROWSER_SUPABASE_STORAGE_KEY && LOVABLE_BROWSER_SUPABASE_SESSION_JSON) {
    await page.evaluate(
      ([key, value]) => window.localStorage.setItem(key, value),
      [LOVABLE_BROWSER_SUPABASE_STORAGE_KEY, LOVABLE_BROWSER_SUPABASE_SESSION_JSON] as const,
    );
  }
}

async function assertAnimationsDisabled(page: Page) {
  const logos = page.locator(".brand-logo");
  await expect(logos.first()).toBeVisible();
  const animationNames = await logos.evaluateAll((els) =>
    els.map((el) => getComputedStyle(el).animationName),
  );
  for (const name of animationNames) {
    expect(name === "none" || name === "").toBeTruthy();
  }
  await expect(
    page.getByRole("img", { name: /PG Group.*Employee Suggestion Portal/i }).first(),
  ).toBeVisible();
}

async function assertNoLayoutShift(page: Page) {
  const firstLogo = page.locator(".brand-logo").first();
  await expect(firstLogo).toBeVisible();
  const boxBefore = await firstLogo.boundingBox();
  expect(boxBefore?.width ?? 0).toBeGreaterThan(0);
  expect(boxBefore?.height ?? 0).toBeGreaterThan(0);

  await page.waitForLoadState("networkidle");
  const boxAfter = await firstLogo.boundingBox();
  expect(Math.abs((boxAfter?.width ?? 0) - (boxBefore?.width ?? 0))).toBeLessThan(2);
  expect(Math.abs((boxAfter?.height ?? 0) - (boxBefore?.height ?? 0))).toBeLessThan(2);
}

test.describe("BrandLogos accessibility & motion", () => {
  for (const path of PUBLIC_PAGES) {
    test(`prefers-reduced-motion disables logo animation on ${path}`, async ({ browser }) => {
      const context = await browser.newContext({ reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.goto(path, { waitUntil: "networkidle" });
      await assertAnimationsDisabled(page);
      await context.close();
    });

    test(`no layout shift / flicker for logos on ${path}`, async ({ page }) => {
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await assertNoLayoutShift(page);
    });
  }

  test.describe("employee dashboard (authenticated)", () => {
    test.skip(!HAS_SESSION, "No injected Supabase session available");

    test(`prefers-reduced-motion disables logo animation on ${DASHBOARD_PATH}`, async ({ browser, baseURL }) => {
      const origin = baseURL ?? "http://localhost:8080";
      const context = await browser.newContext({ reducedMotion: "reduce" });
      const page = await context.newPage();
      await restoreSupabaseSession(context, page, origin);
      await page.goto(DASHBOARD_PATH, { waitUntil: "networkidle" });
      await expect(page).toHaveURL(new RegExp(`${DASHBOARD_PATH}(/|$)`));
      await assertAnimationsDisabled(page);
      await context.close();
    });

    test(`no layout shift / flicker for logos on ${DASHBOARD_PATH}`, async ({ browser, baseURL }) => {
      const origin = baseURL ?? "http://localhost:8080";
      const context = await browser.newContext();
      const page = await context.newPage();
      await restoreSupabaseSession(context, page, origin);
      await page.goto(DASHBOARD_PATH, { waitUntil: "domcontentloaded" });
      await expect(page).toHaveURL(new RegExp(`${DASHBOARD_PATH}(/|$)`));
      await assertNoLayoutShift(page);
      await context.close();
    });
  });
});

