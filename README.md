# Plainmark

Plainmark is a private-by-design Markdown viewer and clipboard exporter. Open one local Markdown file, review a polished read-only GFM preview, then copy the complete document as rich HTML and semantic plain text. Files stay in browser memory and are never uploaded.

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

The repository includes [`render.yaml`](./render.yaml) for a Render Blueprint static site:

- Build command: `npm ci && npm run test:run && npm run build`
- Publish directory: `dist`
- Runtime: static

The Blueprint targets the `evaluation` branch. Create or connect the deployment as a **Render Blueprint/static site**; a manually created service does not automatically adopt `render.yaml` settings. Render must publish `dist`, not `.` or the repository root. Publishing the root serves the development `index.html`, which imports `/src/main.jsx`; a static CDN then returns JSX as `binary/octet-stream`, causing the browser's strict module MIME error. The Vite build instead emits hashed `.js` assets under `dist/assets/`, which Render serves with the correct JavaScript MIME type.

Plainmark uses a single page and no client-side URL router, so no catch-all rewrite is required.

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
