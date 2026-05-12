# Lucide for Obsidian + Excalidraw

A drop-in icon library: **1,700+ [Lucide](https://lucide.dev/) icons** searchable by tag inside Obsidian, draggable straight onto an [Excalidraw](https://github.com/zsviczian/obsidian-excalidraw-plugin) canvas.

## How to use
https://github.com/user-attachments/assets/6b13f9e4-15fe-4a84-a991-06048035ebb6

## Requirements

- [Obsidian](https://obsidian.md/) v1.9 or later (the Bases feature ships with v1.9).
- The [Excalidraw community plugin](https://github.com/zsviczian/obsidian-excalidraw-plugin) installed and enabled.

## Install in under a minute

1. Go to the [latest release](../../releases/latest) and download the asset named **`lucide-for-obsidian-excalidraw.zip`** (NOT the "Source code" zip).
2. **Unzip it, then move its contents (`Assets/` and `lucide-icons.base`) into your vault root.** They must sit *directly* at the vault root, not inside a wrapper folder. macOS Finder will create a `lucide-for-obsidian-excalidraw/` folder when you double-click the zip; open it, then drag everything inside up to your vault root.
3. Open `lucide-icons.base` in Obsidian, switch to **Visual browser** view. (No reload needed; Obsidian picks up new files automatically.)

Terminal one-liner that handles steps 1-2 cleanly (run from your vault root):

```bash
curl -L https://github.com/Rod44/lucide-for-obsidian-excalidraw/releases/latest/download/lucide-for-obsidian-excalidraw.zip -o /tmp/lucide.zip && unzip -o /tmp/lucide.zip -d .
```

That's it.

## Why this exists

The [Excalidraw library directory](https://libraries.excalidraw.com/) tops out at ~65 general-purpose icons per library, and the Obsidian-Excalidraw plugin has no built-in library search. Embedding raw images inside an `.excalidrawlib` file is [a long-standing unsupported feature](https://github.com/excalidraw/excalidraw/issues/5034). So the cleanest path is exactly what this repo does: SVG files on disk + an Obsidian Base for tag search + shift-drag for embedding.

Approach prior art: [zsviczian's icon-library-with-Bases gist](https://gist.github.com/zsviczian/2fd27e4431852d1ee8eabf08d6cdcd17) sketched the Bases + Excalidraw pattern. This repo extends it by bundling the full Lucide set with tags pre-baked into every filename.

## How it works

- Each Lucide SVG is renamed to `name - tag1 tag2 tag3 ....svg`.
- `lucide-icons.base` filters that folder and extracts the name + tags via formulas:
  ```yaml
  formulas:
    icon: file.name.split(" - ")[0]
    keywords: file.name.split(" - ")[1]
    thumb: image(file.path)
  ```
- The cards view uses `image: formula.thumb` to render each SVG as its own thumbnail.
- Obsidian's substring search across the visible columns covers all the tags.
- The Obsidian-Excalidraw plugin handles shift-drag -> image-element embedding natively.

## Build from source

Requires Node 18+ and Git. Regenerates `dist/Assets/icons/lucide/` from the latest Lucide release.

```bash
git clone https://github.com/Rod44/lucide-for-obsidian-excalidraw.git
cd lucide-for-obsidian-excalidraw
node scripts/build.mjs
```

Releases are produced automatically by [.github/workflows/release.yml](.github/workflows/release.yml) on every `v*` tag push.

## Credits

- [Lucide](https://lucide.dev/) — the icon set (ISC license).
- [zsviczian](https://github.com/zsviczian) — Obsidian-Excalidraw plugin and the original Bases-icon-library pattern.
- [Excalidraw](https://excalidraw.com/) — the canvas.

## License

MIT (this repo). Bundled Lucide icons remain under [ISC](https://github.com/lucide-icons/lucide/blob/main/LICENSE).
