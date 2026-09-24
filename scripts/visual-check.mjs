import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright-core";

const browser = await chromium.launch({ channel: "msedge", headless: true });
const problems = [];

for (const viewport of [{ name: "desktop", width: 1440, height: 1000 }, { name: "mobile", width: 390, height: 844 }]) {
  const page = await browser.newPage({ viewport });
  page.on("pageerror", (error) => problems.push(`${viewport.name}: ${error.message}`));
  page.on("response", (response) => {
    if (response.url().startsWith("http://127.0.0.1:4173") && response.status() >= 400) problems.push(`${viewport.name}: ${response.status()} en ${response.url()}`);
  });
  await page.emulateMedia({ colorScheme: viewport.name === "desktop" ? "dark" : "light", reducedMotion: "no-preference" });
  await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(3000);
  const state = await page.evaluate(() => {
    const title = document.querySelector(".hero__title");
    const cv = document.querySelector(".nav__actions .btn");
    const firstCharacter = document.querySelector(".hero .char");
    const cvBounds = cv?.getBoundingClientRect();
    return {
      title: title?.textContent?.replaceAll(" ", " ").trim(),
      titleVisible: title ? getComputedStyle(title).visibility !== "hidden" && title.getBoundingClientRect().height > 0 : false,
      characterTransform: firstCharacter ? getComputedStyle(firstCharacter).transform : null,
      cvInsideViewport: cvBounds ? cvBounds.left >= 0 && cvBounds.right <= innerWidth : false,
      bodyWidth: document.body.scrollWidth,
      viewportWidth: innerWidth,
    };
  });
  if (!state.titleVisible || !state.title?.includes("Victor Nieto")) problems.push(`${viewport.name}: el título principal no está visible`);
  if (!state.cvInsideViewport) problems.push(`${viewport.name}: el botón CV sale del viewport`);
  if (state.bodyWidth > state.viewportWidth) problems.push(`${viewport.name}: existe scroll horizontal (${state.bodyWidth}px > ${state.viewportWidth}px)`);
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += Math.max(innerHeight * 0.7, 400)) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    scrollTo(0, document.documentElement.scrollHeight);
  });
  await page.waitForTimeout(700);
  await page.screenshot({ path: join(tmpdir(), `portfolio-${viewport.name}-verified.png`), fullPage: true });
  console.log(viewport.name, state);
  await page.close();
}

await browser.close();
if (problems.length) {
  console.error(problems.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Visual check passed");
}
