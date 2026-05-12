#!/usr/bin/env node
// Regenerates dist/Assets/icons/lucide/ from the latest Lucide source.
// Each SVG is renamed to embed its tags so an Obsidian Base can search them
// by substring (e.g. `house - home living building residence ...svg`).

import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(os.tmpdir(), `lucide-src-${process.pid}`);
const DST = path.join(ROOT, "dist/Assets/icons/lucide");

const BAD_CHARS = /[\\/:*?"<>|]/g;
const sanitize = (s) => s.replace(BAD_CHARS, "").trim();

console.log(`Cloning Lucide source -> ${SRC}`);
await fs.rm(SRC, { recursive: true, force: true });
execSync(
  `git clone --depth 1 --filter=blob:none --sparse https://github.com/lucide-icons/lucide.git "${SRC}"`,
  { stdio: "inherit" },
);
execSync(`git -C "${SRC}" sparse-checkout set icons`, { stdio: "inherit" });

const ICONS_DIR = path.join(SRC, "icons");
const entries = await fs.readdir(ICONS_DIR);
const stems = [
  ...new Set(entries.map((f) => f.replace(/\.(svg|json)$/, ""))),
].sort();

console.log(`Regenerating ${DST}`);
await fs.rm(DST, { recursive: true, force: true });
await fs.mkdir(DST, { recursive: true });

let written = 0;
for (const stem of stems) {
  let svg;
  try {
    svg = await fs.readFile(path.join(ICONS_DIR, `${stem}.svg`), "utf8");
  } catch {
    continue;
  }

  let meta = {};
  try {
    meta = JSON.parse(
      await fs.readFile(path.join(ICONS_DIR, `${stem}.json`), "utf8"),
    );
  } catch {}

  const aliases = (meta.aliases || [])
    .map((a) => sanitize(a?.name || ""))
    .filter(Boolean);
  const tokens = [
    ...(meta.tags || []).map(sanitize),
    ...(meta.categories || []).map(sanitize),
    ...aliases,
  ];

  const keywords = [];
  const seen = new Set();
  for (const tok of tokens) {
    const lower = tok.toLowerCase();
    if (tok && !seen.has(lower) && lower !== stem.toLowerCase()) {
      seen.add(lower);
      keywords.push(tok);
    }
  }

  const name = sanitize(stem);
  // BSD sed on macOS chokes on filenames above ~240 chars even though the FS
  // accepts longer. Cap conservatively so every downstream tool works.
  const MAX_KW_LEN = 200 - name.length - " - ".length - ".svg".length;
  let kwStr = "";
  for (const kw of keywords) {
    const candidate = kwStr ? `${kwStr} ${kw}` : kw;
    if (candidate.length > MAX_KW_LEN) break;
    kwStr = candidate;
  }

  const filename = kwStr ? `${name} - ${kwStr}.svg` : `${name}.svg`;
  // Tweak the SVG before writing:
  // - currentColor would render invisible on themed backgrounds, lock to black
  // - bump intrinsic width/height from 24 to 96 so default drag-drop into
  //   Excalidraw inserts a usefully-sized icon. The viewBox stays at 24, so
  //   strokes scale uniformly.
  const out = svg
    .replace(/stroke="currentColor"/g, 'stroke="#000"')
    .replace(/width="24"/, 'width="96"')
    .replace(/height="24"/, 'height="96"');
  await fs.writeFile(path.join(DST, filename), out);
  written++;
}

await fs.rm(SRC, { recursive: true, force: true });
console.log(`Wrote ${written} Lucide icons to ${DST}`);
