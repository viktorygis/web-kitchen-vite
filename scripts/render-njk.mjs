import fs from "node:fs/promises";
import path from "node:path";
import nunjucks from "nunjucks";

const SRC_DIR = path.resolve("src");
const PAGES_DIR = path.join(SRC_DIR, "pages");
const OUT_DIR = path.join(SRC_DIR, "site"); // <-- вместо .generated

nunjucks.configure(SRC_DIR, { autoescape: false });

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(p)));
    else files.push(p);
  }
  return files;
}

async function ensureEmptyDir(dir) {
  await fs.rm(dir, { recursive: true, force: true });
  await fs.mkdir(dir, { recursive: true });
}

async function main() {
  await ensureEmptyDir(OUT_DIR);

  const all = await walk(PAGES_DIR);
  const pages = all.filter((f) => f.endsWith(".njk"));

  for (const file of pages) {
    const relFromPages = path.relative(PAGES_DIR, file);      // about-css/start-css.njk
    const outRel = relFromPages.replace(/\.njk$/, ".html");   // about-css/start-css.html
    const outFile = path.join(OUT_DIR, outRel);               // src/site/about-css/start-css.html

    await fs.mkdir(path.dirname(outFile), { recursive: true });

    const templateName = path
      .relative(SRC_DIR, file)
      .split(path.sep)
      .join("/"); // pages/about-css/start-css.njk

    const html = nunjucks.render(templateName, {});
    await fs.writeFile(outFile, html, "utf8");
  }

  console.log(`[render] Rendered ${pages.length} pages to ${path.relative(process.cwd(), OUT_DIR)}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});