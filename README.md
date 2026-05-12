# Lucide for Obsidian + Excalidraw

A drop-in icon library: **1,700+ [Lucide](https://lucide.dev/) icons** searchable by tag inside Obsidian, draggable straight onto an [Excalidraw](https://github.com/zsviczian/obsidian-excalidraw-plugin) canvas.

![The library inside Obsidian](screenshots/01-library.png)

![Lucide icons in an Excalidraw drawing](screenshots/02-excalidraw.png)

## Install (under a minute)

1. **Download** `lucide-for-obsidian-excalidraw.zip` from the [latest release](../../releases/latest).
2. **Unzip into your vault root.** You'll see `Assets/icons/lucide/` and `lucide-icons.base` appear.
3. **Reload Obsidian** (`Cmd/Ctrl+R`), open `lucide-icons.base`, switch to **Visual browser** view.

That's it.

## Use

| What you want | How |
| ------------- | --- |
| Find an icon | Open `lucide-icons.base`, type any tag in the search bar: `arrow`, `chart`, `residence`, `notification`, ... |
| Add it to your drawing | **Shift-drag** the SVG from the Base (or file tree) onto the Excalidraw canvas. Add **Alt** to insert at 1:1 size. |
| Recolor or edit strokes | Right-click the image element in Excalidraw -> **Convert SVG to Excalidraw elements**. Now you can edit colors and individual strokes. |

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
