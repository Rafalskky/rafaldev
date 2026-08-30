/* One-off capture script: portrait screenshots of live project sites. */
import { chromium } from "playwright";
import fs from "node:fs";

const OUT = "/tmp/shots";
fs.mkdirSync(OUT, { recursive: true });

const sites = [
  { slug: "sagobo", url: "https://sagobo.se" },
  { slug: "frisor", url: "https://frisor-five.vercel.app" },
  { slug: "burymeble", url: "https://burymeble.com" },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1000, height: 1333 },
  deviceScaleFactor: 2,
});

for (const site of sites) {
  const page = await context.newPage();
  try {
    await page.goto(site.url, { waitUntil: "networkidle", timeout: 45000 });
  } catch {
    console.log(`${site.slug}: networkidle timeout, continuing`);
  }
  // Let intro animations play out.
  await page.waitForTimeout(4000);

  const totalHeight = await page.evaluate(() => document.body.scrollHeight);
  const viewportH = 1333;
  const positions = [];
  for (let y = 0; y < totalHeight - viewportH / 2; y += Math.round(viewportH * 0.85)) {
    positions.push(y);
  }
  console.log(`${site.slug}: height ${totalHeight}, ${positions.length} shots`);

  for (let i = 0; i < positions.length; i++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), positions[i]);
    // Wait for scroll-reveal animations to finish.
    await page.waitForTimeout(1800);
    const name = `${site.slug}-${String(i).padStart(2, "0")}.png`;
    await page.screenshot({ path: `${OUT}/${name}` });
  }
  await page.close();
}

await browser.close();
console.log("done");
