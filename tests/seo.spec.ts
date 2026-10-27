import { expect, test } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import { getSiteUrl, seo } from "../src/lib/seo";

test("SEO metadata and profile content are present in server-rendered HTML", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto(baseURL!, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle(seo.title);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      seo.description,
    );
    await expect(page.locator("html")).toHaveAttribute("lang", "en-IN");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "index, follow",
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      seo.title,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("AI Engineer");
    await expect(
      page.getByRole("heading", { name: "Selected AI & ML projects." }),
    ).toBeVisible();
    await expect(page.locator(".project-card")).toHaveCount(4);
    await expect(page.locator("main section[aria-labelledby]")).toHaveCount(6);
    const schema = JSON.parse(
      (await page.locator("#profile-schema").textContent()) ?? "{}",
    );
    expect(schema["@type"]).toBe("ProfilePage");
    expect(schema.mainEntity["@type"]).toBe("Person");
    expect(schema.mainEntity.name).toBe("Prit Panchal");
    expect(schema.mainEntity.jobTitle).toBe("AI Engineer");
    expect(schema.mainEntity.worksFor.name).toBe("Navaera Software Services");
    expect(schema.mainEntity.sameAs).toBeUndefined();
    const url = getSiteUrl();
    if (url) {
      // Next.js normalizes the trailing slash on root metadata URLs.
      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      const openGraphUrl = await page
        .locator('meta[property="og:url"]')
        .getAttribute("content");
      expect(new URL(canonical!).href).toBe(`${url}/`);
      expect(new URL(openGraphUrl!).href).toBe(`${url}/`);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        `${url}/social-image`,
      );
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
        "content",
        `${url}/social-image`,
      );
      await expect(
        page.locator('meta[property="og:image:alt"]'),
      ).toHaveAttribute("content", seo.imageAlt);
      expect(schema.url).toBe(`${url}/`);
    } else {
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
      await expect(page.locator('meta[property="og:url"]')).toHaveCount(0);
      await expect(page.locator('meta[property="og:image"]')).toHaveCount(0);
      expect(schema.url).toBeUndefined();
    }
  } finally {
    await context.close();
  }
});

test("crawler files use only the configured production origin", async ({
  request,
}) => {
  const url = getSiteUrl();
  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const robotsText = await robots.text();
  expect(robotsText).toContain("User-Agent: *");
  expect(robotsText).toContain("Allow: /");
  expect(robotsText).not.toContain("Disallow: /");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()["content-type"]).toContain("xml");
  const xml = await sitemap.text();
  if (url) {
    expect(robotsText).toContain(`Sitemap: ${url}/sitemap.xml`);
    expect(xml).toContain(`<loc>${url}/</loc>`);
    expect(xml.match(/<loc>/g)).toHaveLength(1);
  } else {
    expect(robotsText).not.toContain("Sitemap:");
    expect(xml).not.toContain("<loc>");
  }
  expect(xml).not.toContain("localhost");
  expect(xml).not.toContain("#projects");
});

test("social preview is a valid 1200 by 630 PNG", async ({
  request,
}, testInfo) => {
  const response = await request.get("/social-image");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/png");
  const image = await response.body();
  expect(image.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
  expect(image.readUInt32BE(16)).toBe(1200);
  expect(image.readUInt32BE(20)).toBe(630);
  expect(image.length).toBeGreaterThan(10_000);
  if (testInfo.project.name === "desktop")
    await writeFile(".qa/social-preview.png", image);
});
