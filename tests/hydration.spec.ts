import { expect, test } from "@playwright/test";

test("extension attributes on html do not disrupt hydration or controls", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  // Reproduce the extension mutation before the application's scripts run.
  await page.addInitScript(() => {
    const addExtensionAttributes = () => {
      if (!document.documentElement) return false;
      document.documentElement.setAttribute("crxlauncher", "");
      document.documentElement.setAttribute("crxlauncher-bridged", "");
      return true;
    };
    if (!addExtensionAttributes()) {
      const observer = new MutationObserver(() => {
        if (addExtensionAttributes()) observer.disconnect();
      });
      observer.observe(document, { childList: true });
    }
  });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("crxlauncher-bridged", "");
  const menu = page.getByRole("button", {
    name: "Open navigation",
    exact: true,
  });
  if (await menu.isVisible()) await menu.click();
  await page.getByRole("button", { name: "Use green theme" }).click();
  await expect(page.locator(".workspace")).toHaveAttribute(
    "data-theme",
    "green",
  );
  if (
    await page
      .getByRole("button", { name: "Close navigation", exact: true })
      .first()
      .isVisible()
  ) {
    await page
      .getByRole("button", { name: "Close navigation", exact: true })
      .first()
      .click();
  }
  await page.getByRole("button", { name: "Open interactive terminal" }).click();
  const input = page.getByRole("textbox", { name: "Terminal command" });
  await input.fill("whoami");
  await input.press("Enter");
  await expect(page.locator(".terminal-dialog")).toContainText("Prit Panchal");
  expect(errors).toEqual([]);
});
