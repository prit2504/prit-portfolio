import { expect, test } from "@playwright/test";
import { navigation } from "../src/lib/portfolio";

async function openExplorer(page: import("@playwright/test").Page) {
  const toggle = page.getByRole("button", {
    name: "Open navigation",
    exact: true,
  });
  if (await toggle.isVisible()) await toggle.click();
}

async function expectSectionPosition(
  page: import("@playwright/test").Page,
  id: string,
) {
  await expect
    .poll(() =>
      page.evaluate((sectionId) => {
        const offset = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--navigation-offset",
          ),
        );
        const section = document.getElementById(sectionId)!;
        const maximum = Math.max(
          0,
          document.documentElement.scrollHeight - innerHeight,
        );
        const expected =
          sectionId === "home"
            ? 0
            : Math.min(
                maximum,
                Math.max(
                  0,
                  scrollY + section.getBoundingClientRect().top - offset,
                ),
              );
        return Math.abs(scrollY - expected) <= 2;
      }, id),
    )
    .toBe(true);
}

test("resume content renders without runtime errors or horizontal overflow", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page).toHaveTitle(
    "Prit Panchal | Full-Stack AI Engineer · Generative AI & Agents",
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Panchal",
  );
  await expect(page.locator("main section")).toHaveCount(6);
  await expect(
    page.getByText(
      "Observed in an internally tested AML/FINTRAC narration pipeline.",
    ),
  ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  await page.screenshot({ path: `.qa/${testInfo.project.name}-home.png` });
  await page.screenshot({
    path: `.qa/${testInfo.project.name}-full.png`,
    fullPage: true,
  });
});

test("project filters and project dialogs work with keyboard dismissal", async ({
  page,
}) => {
  await page.goto("/");
  const filters = page.getByRole("group", { name: "Filter projects" });
  await filters.getByRole("button", { name: "Platforms", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  const projectButton = page.getByRole("button", {
    name: "View PixelDrift project details",
  });
  await projectButton.click();
  await expect(
    page.getByRole("dialog", { name: "PixelDrift" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Visit live project" })).toHaveAttribute("href", "https://pixeldrift.online");
  await page.keyboard.press("Escape");
  await expect(page.locator(".project-dialog")).not.toBeVisible();
  await expect(projectButton).toBeFocused();
  await filters.getByRole("button", { name: "RAG", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await filters.getByRole("button", { name: /All projects/ }).click();
  await expect(page.locator(".project-card")).toHaveCount(2);
});

test("terminal supports commands, autocomplete, history, themes, and navigation", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  const terminal = page.getByRole("dialog", { name: "prit@portfolio: ~" });
  const input = page.getByRole("textbox", { name: "Terminal command" });
  await expect(terminal).toBeVisible();
  await expect(input).toBeFocused();
  await input.fill("whoa");
  await input.press("Tab");
  await expect(input).toHaveValue("whoami");
  await input.press("Enter");
  await expect(terminal).toContainText("Prit Panchal — Full-Stack AI Engineer");
  await input.fill("not-a-command");
  await input.press("Enter");
  await expect(terminal).toContainText("Command not found: not-a-command");
  await input.press("ArrowUp");
  await expect(input).toHaveValue("not-a-command");
  await input.fill("theme green");
  await input.press("Enter");
  await expect(page.locator(".workspace")).toHaveAttribute(
    "data-theme",
    "green",
  );
  await input.fill("clear");
  await input.press("Enter");
  await expect(terminal.locator(".terminal-entry")).toHaveCount(0);
  await input.fill("cd projects");
  await input.press("Enter");
  await expect(terminal).not.toBeVisible();
  await expect(page).toHaveURL(/#projects$/);
  await page.reload();
  await expect(page.locator(".workspace")).toHaveAttribute(
    "data-theme",
    "green",
  );
});

test("resume downloads and contact destinations are valid", async ({
  page,
}) => {
  await page.goto("/");
  if (test.info().project.name === "mobile")
    await page
      .getByRole("button", { name: "Open navigation", exact: true })
      .click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download resume .docx" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("Prit_Panchal_Resume.docx");
  expect(await download.failure()).toBeNull();
  const response = await page.request.get("/Prit_Panchal_Resume.docx");
  expect(response.status()).toBe(200);
  expect((await response.body()).length).toBeGreaterThan(30_000);
  await expect(page.locator(".contact-email")).toHaveAttribute(
    "href",
    "mailto:pprit2504@gmail.com",
  );
  await expect(
    page.getByRole("link", { name: "+91 9313975183" }),
  ).toHaveAttribute("href", "tel:+919313975183");
});

test("explorer navigation follows the selected section", async ({ page }) => {
  await page.goto("/");
  if (test.info().project.name === "mobile")
    await page
      .getByRole("button", { name: "Open navigation", exact: true })
      .click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "stack.json" })
    .click();
  await expect(page).toHaveURL(/#skills$/);
  await expect(page.locator(".editor-tab")).toContainText("stack.json");
  await expect(
    page.getByRole("heading", { name: "Technical skills." }),
  ).toBeVisible();
  if (test.info().project.name === "mobile")
    await expect(
      page.getByRole("button", { name: "Open navigation", exact: true }),
    ).toHaveAttribute("aria-expanded", "false");
});

test("copy email gives a real clipboard confirmation", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(
    page.getByRole("button", { name: "Copied to clipboard" }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "pprit2504@gmail.com",
  );
});

test("theme buttons change the visible colors and preserve the choice", async ({
  page,
}) => {
  // The sidebar must scroll its controls above the status bar on short screens.
  await page.setViewportSize({
    width: page.viewportSize()!.width,
    height: 600,
  });
  await page.goto("/");
  await openExplorer(page);
  await page.getByRole("button", { name: "Use green theme" }).click();
  await expect(
    page.getByRole("button", { name: "Use green theme" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".button-primary").first()).toHaveCSS(
    "background-color",
    "rgb(164, 197, 140)",
  );
  await page.reload();
  await expect(page.locator(".button-primary").first()).toHaveCSS(
    "background-color",
    "rgb(164, 197, 140)",
  );
  await openExplorer(page);
  await page.getByRole("button", { name: "Use amber theme" }).click();
  await expect(
    page.getByRole("button", { name: "Use amber theme" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".button-primary").first()).toHaveCSS(
    "background-color",
    "rgb(221, 176, 120)",
  );
});

test("every explorer link reaches its section and keeps one correct highlight", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const nav = page.locator('nav[aria-label="Main navigation"]');
  for (const id of [
    "contact",
    "about",
    "skills",
    "projects",
    "experience",
    "home",
  ]) {
    await openExplorer(page);
    const item = navigation.find((item) => item.id === id)!;
    await nav.getByRole("link", { name: item.file }).click();
    await expectSectionPosition(page, id);
    await expect(nav.locator('[aria-current="location"]')).toHaveCount(1);
    await expect(nav.locator('[aria-current="location"]')).toHaveAttribute(
      "href",
      `#${id}`,
    );
    await expect(page.locator(".editor-tab")).toContainText(item.file);
  }
});

test("manual scrolling, deep links, and browser back keep navigation in sync", async ({
  page,
}) => {
  await page.goto("/#projects");
  const selected = page.locator('nav [aria-current="location"]');
  await expectSectionPosition(page, "projects");
  await expect(selected).toHaveAttribute("href", "#projects");
  await openExplorer(page);
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "stack.json" })
    .click();
  await expectSectionPosition(page, "skills");
  await page.goBack();
  await expectSectionPosition(page, "projects");
  await expect(selected).toHaveAttribute("href", "#projects");
  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await expect(selected).toHaveAttribute("href", "#contact");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(selected).toHaveAttribute("href", "#home");
});

test("all terminal launchers work and terminal navigation lands correctly", async ({
  page,
}) => {
  await page.goto("/");
  for (const launcher of ["header", "sidebar", "statusbar"]) {
    if (launcher === "sidebar") {
      await openExplorer(page);
      await page
        .getByRole("button", { name: "Try the interactive shell" })
        .click();
    } else if (launcher === "header") {
      await page
        .getByRole("button", { name: "Open interactive terminal" })
        .click();
    } else {
      await page
        .locator(".statusbar")
        .getByRole("button", { name: /Open terminal/ })
        .click();
    }
    const terminal = page.locator(".terminal-dialog");
    const input = page.getByRole("textbox", { name: "Terminal command" });
    await expect(terminal).toBeVisible();
    await expect(input).toBeFocused();
    const startingScroll = await page.evaluate(() => scrollY);
    await input.fill("help");
    await input.press("Enter");
    await expect(terminal).toContainText("EXPLORE");
    expect(await page.evaluate(() => scrollY)).toBe(startingScroll);
    await input.fill("cd experience");
    await input.press("Enter");
    await expect(terminal).not.toBeVisible();
    await expectSectionPosition(page, "experience");
    await expect(page.locator('nav [aria-current="location"]')).toHaveAttribute(
      "href",
      "#experience",
    );
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  }
});
