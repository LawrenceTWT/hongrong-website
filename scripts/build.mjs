import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const output = join(root, "dist");
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const entries = await readdir(root, { withFileTypes: true });
for (const entry of entries) {
  if (entry.isFile() && /\.(?:html|txt|xml)$/.test(entry.name)) {
    await cp(join(root, entry.name), join(output, entry.name));
  }
}
for (const folder of ["css", "js", "assets"]) {
  await cp(join(root, folder), join(output, folder), { recursive: true });
}

console.log("Static production build created in dist/.");
