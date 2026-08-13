# Plainmark

Plainmark is a private-by-design Markdown viewer and clipboard exporter. Open one local Markdown file, review a polished read-only GFM preview, then copy the complete document as rich HTML and semantic plain text. Files stay in browser memory and are never uploaded.

**Live application:** [plainmark.mohitpandey.in](https://plainmark.mohitpandey.in/)

## Features

- Opens one `.md` or `.markdown` file up to 1 MB by picker or drag and drop.
- Renders headings, paragraphs, nested and task lists, tables, blockquotes, inline and fenced code, emphasis, strikethrough, links, and horizontal rules.
- Applies declared-language syntax highlighting and preserves code-block language metadata for Notion.
- Copies portable rich HTML for Microsoft Word, Google Docs, and Notion, with a semantic plain-text fallback.
- Keeps wide tables and code keyboard-accessible without widening the page.
- Rejects unsafe URLs, does not execute raw Markdown HTML, and does not fetch remote images automatically.
- Includes a downloadable [`sample-file.md`](./public/sample-file.md) for evaluation.

## Local development

Requirements: Node.js `^20.19.0` or `>=22.13.0` and npm.

```bash
npm ci
npm run dev
```

Use the local URL printed by Vite.

## Validation

```bash
npm run test:run
npm run lint
npm run build
npm run preview
```

The production build is generated in `dist/`.

## Render deployment

The repository includes [`render.yaml`](./render.yaml) for deployment as a Render static site:

- Build command: `npm ci && npm run test:run && npm run build`
- Publish directory: `dist`
- Runtime: static

Render must publish `dist`, not the repository root. Plainmark is a single-page static application without client-side routes, so no rewrite rule is required.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run test:run` | Run the deterministic test suite once |
| `npm run lint` | Run ESLint |
| `npm run build` | Create the deployable `dist/` output |
| `npm run preview` | Serve `dist/` locally |

## Privacy and limitations

Document content stays on the device. Plainmark has no backend, persistence, accounts, analytics, or document network requests. It is intentionally a viewer rather than an editor. Raw HTML, math typesetting, Mermaid, local assets, and automatic remote-image embedding are not supported.
