import { readFile, readdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const [header, footer, landscape] = await Promise.all([
  read("partials/header.html"),
  read("partials/footer.html"),
  read("partials/landscape.html"),
]);
const check = process.argv.includes("--check");
const stale = [];
for (const file of (await readdir(root)).filter((name) =>
  name.endsWith(".html"),
)) {
  const original = await read(file);
  const page = original.match(/data-page="([^"]+)"/)?.[1];
  const nav = header.replace(
    /(<a\b[^>]*data-nav-page=")([^"]+)("[^>]*)(>)/g,
    (match, before, target, after, close) =>
      `${before}${target}${after}${target === page ? ' aria-current="page"' : ""}${close}`,
  );
  const pageFooter = footer.replace(
    "{{landscape}}",
    file === "index.html" ? landscape.trim() : "",
  );
  const next =
    original
      .replace(
        /<!-- shared:header:start -->[\s\S]*?<!-- shared:header:end -->/,
        `<!-- shared:header:start -->\n${nav.trim()}\n<!-- shared:header:end -->`,
      )
      .replace(
        /<!-- shared:footer:start -->[\s\S]*?<!-- shared:footer:end -->/,
        `<!-- shared:footer:start -->\n${pageFooter.trim()}\n<!-- shared:footer:end -->`,
      )
      .replace(/[ \t]+$/gm, "")
      .trimEnd() + "\n";
  if (next !== original) {
    stale.push(file);
    if (!check) await writeFile(new URL(`../${file}`, import.meta.url), next);
  }
}
if (check && stale.length)
  throw new Error(
    `Shared layout is stale in ${stale.join(", ")}; run npm run sync`,
  );
console.log(
  check
    ? "Shared navigation and footers are consistent."
    : "Shared navigation and footers synchronized.",
);
