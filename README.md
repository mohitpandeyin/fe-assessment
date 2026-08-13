# Plainmark

Plainmark is a private-by-design Markdown viewer and clipboard exporter. Open one local Markdown file, review a polished read-only GFM preview, then copy the complete document in rich HTML and semantic plain text. Where the browser permits it, Plainmark also includes the exact source as `text/markdown`.

- **Live application:** [fe-assessment-zinf.onrender.com](https://fe-assessment-zinf.onrender.com/)
- **Source:** [github.com/mohitpandeyin/fe-assessment](https://github.com/mohitpandeyin/fe-assessment)
- **Assignment:** [Frontend Developer Assignment](./requirements/Frontend_Developer_Assignment.pdf)

## Core assignment coverage

| Required behavior | Implementation |
|---|---|
| One Markdown file at a time | Picker and drag/drop accept one `.md` or `.markdown` file up to 1 MB |
| Accurate GFM rendering | Headings, paragraphs, ordered/unordered/nested/task lists, tables, blockquotes, inline/fenced code, emphasis, strikethrough, links, and rules |
| Malformed-input resilience | Safe parser defaults, localized render recovery, validation errors, and readable degradation |
| Single rich Copy action | One user action writes `text/html` and `text/plain`, plus `text/markdown` when supported |
| Browser-only operation | Files stay in memory in the current tab; there is no backend, upload, persistence, analytics, or document network request |
| React, JavaScript, Tailwind | React 19 + JavaScript/JSX + Vite 8 + Tailwind CSS 4 and authored CSS |

The product intentionally remains a viewer, not an editor. Its focused flow is **open → read → copy → replace or start over**.

## Thoughtful enhancements

- Read-only code-language labels covering the requested Notion language set.
- Curated declared-language syntax highlighting without automatic language guessing.
- Per-code-block copy controls that never leak into full-document export.
- Keyboard-operable horizontal code and table regions.
- Safe remote-image and unsupported-link fallbacks.
- Responsive desktop file-details sidebar and mobile native-dialog sheet.
- Portable rich-copy treatments validated in Microsoft Word, Google Docs, and Notion.

These enhancements were added only after the required file, rendering, copy, safety, accessibility, and responsive gates passed.

## Run locally

Requirements: Node.js `^20.19.0` or `>=22.13.0` and npm.

```bash
git clone https://github.com/mohitpandeyin/fe-assessment.git
cd fe-assessment
npm ci
npm run dev
```

Open the local URL printed by Vite. To exercise the complete rendering surface, download and upload [`public/sample-file.md`](./public/sample-file.md), which is also available from the home screen's **Sample File.** link.

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the local Vite development server |
| `npm run test:run` | Run the complete deterministic test suite once |
| `npm run test` | Run Vitest in watch mode |
| `npm run lint` | Run ESLint across the project |
| `npm run build` | Create the production client and static-hosting worker output |
| `npm run preview` | Serve the built client locally |

## How it works

1. The file-intake layer validates count, extension, inclusive size limit, readability, and binary-looking content before committing a document.
2. A small reducer owns the empty, reading, ready, and replacement lifecycle so a failed replacement never discards the active file.
3. `react-markdown` and `remark-gfm` render semantic React elements. Raw HTML is disabled, URLs are filtered, remote images are not fetched, and unsafe/local resources degrade to readable fallbacks.
4. The preview uses responsive, accessible project CSS. Overflow belongs to the code/table element rather than widening the page.
5. Full-document copy clones only the semantic article, removes preview controls, sanitizes attributes, and generates three complementary representations:
   - portable inline-styled semantic HTML for rich editors;
   - purpose-built semantic plain text for code editors and basic destinations;
   - exact original Markdown when the browser supports the MIME type.

This separation is important: the browser preview and clipboard output preserve the same content semantics, but they require different presentation strategies.

## Design and technical decisions

- **Tool-like interface:** a restrained graphite header, neutral reading surface, compact controls, and no promotional chrome keep attention on the document.
- **Read-only by design:** code-language metadata is inferred from the fence and displayed as a fixed label; no editor state or code mutation is introduced.
- **Hybrid styling:** Tailwind handles layout and responsive composition, while authored CSS owns tokens, reusable component states, Markdown typography, and clipboard-specific export rules.
- **No UI kit or state library:** native controls, a native `<dialog>`, small owned components, and React state/reducer were sufficient for the interaction model.
- **Literal code fidelity:** rich export keeps real newline characters in one semantic code payload. A single presentation container owns background, border, and padding, avoiding editor-specific paragraph gaps and fragmented line shading.
- **Semantic quotes:** nested `<blockquote>` structure is preserved for Notion while paragraph-level border/indentation fallbacks make Word and Google Docs readable.
- **Dependency discipline:** `react-markdown` + `remark-gfm` provide the maintained parser baseline; `lowlight` provides bounded local highlighting; `lucide-react` supplies consistent accessible icons. No dependency handles application state, storage, analytics, or networking.

Detailed rationale and postmortems live in the [content/copy contract](./docs/CONTENT_RENDERING_AND_COPY.md), [element improvement reference](./docs/elements-improvement.md), [architecture](./docs/FRONTEND_ARCHITECTURE.md), and [progress log](./progress.md).

## Privacy and safety

- Document contents are read with browser file APIs and held only in memory.
- No content is uploaded, persisted in browser storage, logged, analyzed, or sent to a server.
- Raw Markdown HTML is not executed.
- Unsafe URL schemes are inert; external links use safe isolation.
- Remote images are not fetched automatically. Plainmark shows their alt text and, when safe, a source link.
- Clipboard HTML is generated from a controlled semantic clone and strips preview UI and unsafe attributes.

The deployed site serves static application assets only. The hosting worker provides SPA fallback and does not process document contents.

## Accessibility and responsive behavior

- Semantic landmarks and heading levels are retained.
- All actions are keyboard reachable with visible AA-contrast focus treatment.
- Loading and clipboard outcomes are announced; errors remain recoverable.
- The mobile file-details view uses a controlled native dialog with focus restoration.
- Code and tables expose labeled, focusable overflow regions with Arrow Left/Right and Home/End support.
- Compact controls meet a 44 px touch target on touch layouts.
- The layout has been checked from 320 px through wide desktop widths and with reduced-motion preferences.

## Verification

The release gate covers 13 test files / 71 tests, ESLint, a production build, lockfile-based installation, vulnerability audit, and diff validation. The stress fixture is approximately 17 KB / 1,981 words and exercises deep nesting, task states, 10 code blocks, four tables, Unicode, long URLs/tokens, media fallbacks, and malformed boundaries.

### Browser matrix

| Browser | Verified behavior |
|---|---|
| Chrome 151.0.7922.137 | File lifecycle, complete rendering, responsive layout, rich clipboard |
| Firefox 153.0.4 | Complete rendering and rich HTML delivery into Word/Google Docs |
| Safari 26.6 | Complete rendering and rich HTML delivery into Notion |

### Destination matrix

| Destination | Verified result | Bounded limitation |
|---|---|---|
| Microsoft Word Online | Native headings/navigation, lists, editable tables, semantic quotes, connected fenced-code boxes, exact code newlines, links | Inline code retains monospace text and wrapping but Word drops its background, border, and padding |
| Google Docs | Native outline, lists, editable tables, semantic quotes, connected fenced-code boxes without synthetic blank lines, inline-code shading | Destination controls pagination and may tightly wrap very wide tables |
| Notion | Native hierarchy, lists/tasks, tables, quotes, code blocks with normalized declared-language metadata | Notion controls final colors and typography |
| VS Code | Exact semantic `text/plain`, including quote/list markers, tab-separated tables, and code whitespace | Rich formatting is intentionally not used |

Destination editors normalize imported HTML into their own document models, so the compatibility promise is semantic structure, complete content, readability, and useful formatting—not pixel-identical output.

## Known limitations and incomplete items

- Maximum file size is 1 MB. A realistic boundary file became usable in about 1.13 seconds; pathologically dense structured Markdown can be materially slower.
- Plainmark does not edit Markdown, manage multiple files, persist sessions, generate a table of contents, or resolve local assets.
- Raw HTML, math typesetting, Mermaid, definition lists, and specialized admonition cards are not enabled. Unsupported syntax remains inert or readable where possible.
- Remote images are deliberately not embedded.
- Custom `text/markdown` clipboard data depends on browser capability; HTML/plain text remain the required core formats.
- Wide tables remain horizontally navigable in the app and may become tall/tightly wrapped in portrait-oriented document editors.
- Rich-editor paste modes and destination defaults can change exact fonts, colors, borders, spacing, and pagination.

## AI-assistant use

OpenAI Codex was used as a coding assistant for requirements traceability, implementation, tests, documentation, compatibility research, and iterative diagnosis. Human-provided Word, Google Docs, Notion, and VS Code paste screenshots were treated as the source of truth for destination behavior. Every accepted change was reviewed against the generated clipboard structure and rerun through automated lint, test, build, and manual destination checks. The root causes and rejected approaches are documented so the implementation can be explained without relying on the assistant.

## With additional time

1. Add automated browser-level clipboard checks where platform security permits.
2. Add optional, privacy-explicit remote image embedding.
3. Explore destination-specific table improvements without regressing editable semantics.
4. Add a generated table of contents and in-document navigation.
5. Broaden syntax-highlight coverage while retaining declared-language-only behavior.
6. Add opt-in export formats such as downloadable HTML or PDF.

## Documentation

Start with the [documentation index](./docs/README.md). Product requirements, UI specifications, design tokens, architecture, clipboard behavior, element-level compatibility decisions, and the chronological implementation record are all kept in the repository for interview discussion.
