# Plainmark

Plainmark is a private-by-design Markdown viewer and clipboard exporter. Open one local Markdown file, review a polished read-only GFM preview, then copy the complete document as portable rich HTML and semantic plain text. Where the browser permits it, Plainmark also includes the exact source as `text/markdown`.

- **Live application:** [plainmark.mohitpandey.in](https://plainmark.mohitpandey.in/)
- **Source:** [github.com/mohitpandeyin/fe-assessment](https://github.com/mohitpandeyin/fe-assessment)
- **Evaluation fixture:** [`public/sample-file.md`](./public/sample-file.md)

The product intentionally remains a viewer, not an editor. Its focused flow is **open → read → copy → replace or start over**.

## Core coverage

| Required behavior | Implementation |
|---|---|
| One Markdown file at a time | Picker and drag/drop accept one `.md` or `.markdown` file up to 1 MB |
| Accurate GFM rendering | Headings, paragraphs, ordered/unordered/nested/task lists, tables, blockquotes, inline/fenced code, emphasis, strikethrough, links, and horizontal rules |
| Malformed-input resilience | Safe parser defaults, localized render recovery, validation errors, and readable degradation |
| Single rich-copy action | One action writes `text/html` and `text/plain`, plus `text/markdown` when supported |
| Browser-only operation | Files remain in memory in the current tab; there is no backend, upload, persistence, analytics, or document network request |
| Modern frontend stack | React 19, JavaScript/JSX, Vite 8, Tailwind CSS 4, and authored CSS |

## Thoughtful enhancements

- Read-only code-language labels covering the requested Notion language set.
- Declared-language syntax highlighting without automatic language guessing.
- Per-code-block copy controls that never leak into full-document export.
- Keyboard-operable horizontal code and table regions.
- Safe remote-image and unsupported-link fallbacks.
- Responsive desktop file-details sidebar and mobile native-dialog sheet.
- Portable rich-copy treatments validated in Microsoft Word, Google Docs, Notion, and VS Code.
- A downloadable sample document available directly from the home screen.

## Run locally

Requirements: Node.js `^20.19.0` or `>=22.13.0` and npm.

```bash
git clone https://github.com/mohitpandeyin/fe-assessment.git
cd fe-assessment
npm ci
npm run dev
```

Open the URL printed by Vite. To exercise the complete rendering surface, upload [`public/sample-file.md`](./public/sample-file.md) or download it from the home screen's **Sample File.** link.

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local Vite development server |
| `npm run test:run` | Run the deterministic test suite once |
| `npm run test` | Run Vitest in watch mode |
| `npm run lint` | Run ESLint across the project |
| `npm run build` | Create the deployable production output in `dist/` |
| `npm run preview` | Serve the production build locally |

## How it works

1. The file-intake layer validates file count, extension, inclusive size limit, readability, and binary-looking content before committing a document.
2. A small reducer owns the empty, reading, ready, and replacement lifecycle, so a failed replacement never discards the active file.
3. `react-markdown` and `remark-gfm` render semantic React elements. Raw HTML is disabled, URLs are filtered, remote images are not fetched, and unsafe or local resources degrade to readable fallbacks.
4. Responsive project CSS keeps overflow inside code and table regions instead of allowing wide content to expand the page.
5. Full-document copy clones only the semantic article, removes preview controls, sanitizes attributes, and generates three complementary representations:
   - portable inline-styled HTML for rich document editors;
   - purpose-built semantic plain text for code editors and basic destinations;
   - exact original Markdown when the browser supports the MIME type.

The browser preview and clipboard output preserve the same content semantics, but they deliberately use different presentation strategies. Stylesheets work well in the application; portable inline styles and carefully selected semantic elements survive rich-editor paste pipelines more reliably.

## Design and technical decisions

- **Tool-like interface:** a restrained graphite header, neutral reading surface, compact controls, and minimal promotional chrome keep attention on the document.
- **Read-only by design:** code-language metadata comes from the Markdown fence and appears as a fixed label. No editor state or code mutation is introduced.
- **Hybrid styling:** Tailwind handles layout and responsive composition, while authored CSS owns tokens, reusable component states, Markdown typography, and clipboard-specific export rules.
- **Small owned component layer:** native controls, a native `<dialog>`, focused reusable components, and React state/reducer are sufficient for the interaction model; no UI kit or state library is required.
- **Literal code fidelity:** rich export keeps real newline characters in one semantic code payload. A single presentation container owns its background, border, and padding, avoiding editor-specific paragraph gaps and fragmented line shading.
- **Semantic quotes:** nested `<blockquote>` structure is retained for Notion, while controlled border, indentation, line-height, and paragraph spacing keep Word and Google Docs readable.
- **Declared-language highlighting:** `lowlight` and a bounded grammar set highlight recognized fences locally. Missing or unsupported declarations remain readable as Plain Text.
- **Dependency discipline:** parsing, highlighting, and icons use focused dependencies; application state, storage, analytics, and networking do not.

## Clipboard compatibility

Rich document editors normalize pasted HTML into their own document models. Plainmark therefore promises semantic structure, complete content, readability, and useful formatting rather than pixel-identical output.

| Destination | Verified result | Bounded limitation |
|---|---|---|
| Microsoft Word Online | Native headings/navigation, lists, editable tables, semantic quotes, connected fenced-code boxes, exact code newlines, and links | Inline code keeps monospace text and wrapping, but Word may discard its background, border, or padding |
| Google Docs | Native outline, lists, editable tables, semantic quotes, connected fenced-code boxes without synthetic blank lines, and inline-code shading | Google Docs controls pagination and can tightly wrap unusually wide content |
| Notion | Native hierarchy, lists/tasks, tables, quotes, and code blocks with normalized declared-language metadata | Notion controls final colors and typography |
| VS Code and plain-text targets | Semantic plain text with quote/list markers, tab-separated tables, links, and exact code whitespace | Rich formatting is intentionally not used |

### Code-block export root cause and solution

Word, Google Docs, and Notion interpret `<pre>`, `<code>`, line breaks, and paragraph spacing differently. Earlier line-by-line wrappers and inserted `<br>` elements caused either synthetic blank lines, fragmented backgrounds, or collapsed code in one or more destinations.

The final serializer keeps each fenced block as one semantic code payload with literal newline characters. One outer container owns the rectangular background, border, and padding; line-height is controlled once; and no editable code UI is exported. This preserves intentional newlines while avoiding destination-generated blank paragraphs.

## Privacy and safety

- Document contents are read with browser file APIs and held only in memory.
- No content is uploaded, persisted in browser storage, logged, analyzed, or sent to a server.
- Raw Markdown HTML is not executed.
- Unsafe URL schemes are inert, and external links use safe isolation.
- Remote images are not fetched automatically. Plainmark shows readable fallback content instead.
- Clipboard HTML is generated from a controlled semantic clone and strips preview UI and unsafe attributes.

The deployed site serves static application assets only and never processes document contents.

## Accessibility and responsive behavior

- Semantic landmarks and heading levels are retained.
- All actions are keyboard reachable with visible focus treatment.
- Loading, clipboard outcomes, and recoverable errors are announced.
- The mobile file-details view uses a controlled native dialog with focus restoration.
- Code and tables expose labeled, focusable overflow regions with Arrow Left/Right and Home/End support.
- Compact controls retain touch-friendly target sizes on narrow layouts.
- The page contains long URLs, unbroken tokens, code, and tables without widening the document viewport.
- Reduced-motion preferences are respected.

## Verification

The final release gate includes:

- 13 test files and 72 automated tests;
- ESLint validation;
- lockfile-based installation;
- a production Vite build;
- a zero-vulnerability npm audit at release time;
- live asset and MIME-type checks on Render;
- manual copy/paste review in Word, Google Docs, Notion, and VS Code.

The included sample document is approximately 17 KB / 2,031 words and exercises deep nesting, task states, ten fenced code blocks, tables, Unicode, long URLs and tokens, media fallbacks, consecutive elements, and malformed parser boundaries.

## Production deployment

The repository includes [`render.yaml`](./render.yaml) for a Render static site:

- Build command: `npm ci && npm run test:run && npm run build`
- Publish directory: `dist`
- Runtime: static

`dist/` is generated during every deployment and is intentionally excluded from Git. Render must publish `dist`, not the repository root; publishing the root would serve the development entry point instead of Vite's compiled JavaScript assets.

Plainmark has no client-side URL routes, so no catch-all rewrite is required. The custom domain redirects HTTP to HTTPS.

## Known limitations

- Maximum file size is 1 MB. Pathologically dense structured Markdown can still take longer to render than ordinary documents.
- Plainmark does not edit Markdown, manage multiple files, persist sessions, generate a table of contents, or resolve local assets.
- Raw HTML, math typesetting, Mermaid, definition lists, and specialized admonition cards are not enabled. Unsupported syntax remains inert or readable where possible.
- Remote images are deliberately not embedded.
- Custom `text/markdown` clipboard data depends on browser capability; HTML and plain text remain the core formats.
- Wide tables remain horizontally navigable in the app and may become tall or tightly wrapped in portrait-oriented document editors.
- Rich-editor defaults can change exact fonts, colors, borders, spacing, and pagination.

## With additional time

1. Add automated browser-level clipboard checks where platform security permits.
2. Add optional, privacy-explicit remote-image embedding.
3. Explore destination-specific table improvements without regressing editable semantics.
4. Add a generated table of contents and in-document navigation.
5. Broaden syntax-highlight coverage while retaining declared-language-only behavior.
6. Add opt-in exports such as downloadable HTML or PDF.

## AI-assisted development

OpenAI Codex was used as a coding assistant for requirements traceability, implementation, testing, compatibility research, and iterative diagnosis. Human-provided Microsoft Word, Google Docs, Notion, and VS Code screenshots were treated as the source of truth for destination behavior. Accepted changes were checked against the generated clipboard structure and rerun through lint, tests, production builds, and destination reviews.
