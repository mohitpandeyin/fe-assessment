# Content Rendering and Rich-Copy Contract

**Status:** Approved implementation baseline

**Priority:** Semantic accuracy, readability, and portability before visual matching

**Applies to:** Onscreen preview and clipboard output

## 1. Purpose

This document defines how Markdown content must look and behave in Plainmark and after it is pasted into Microsoft Word, Google Docs, Notion, and other editors.

The v1 goal is not pixel-perfect reproduction of the browser preview. The goal is to preserve the complete document, its hierarchy, and the commonly supported formatting needed for a clean and editable result.

Success means:

- No supported content is omitted or hidden.
- The same semantic document structure drives preview and copy output.
- Required elements remain readable and clearly distinguishable.
- Wide or long content does not break the preview layout.
- Rich-text destinations receive portable semantic HTML rather than application CSS classes.
- Differences imposed by a destination editor are treated as compatibility limitations, not corrected with editor-specific hacks.

## 2. Fidelity contract

Plainmark provides two related presentations of one document:

1. **Preview presentation:** responsive browser styling through semantic HTML and `markdown.css`.
2. **Clipboard presentation:** conservative semantic HTML with essential inline styles, plus plain-text and original-Markdown alternatives.

The two presentations should share hierarchy, content order, emphasis, table structure, list structure, link targets, code whitespace, and meaningful image alternatives. They are not required to share exact fonts, line wrapping, page width, shadows, syntax colors, or pixel measurements.

The destination owns final paste behavior. Word can keep or merge source formatting; Google Docs can normalize fonts and spacing; Notion converts supported HTML into its own blocks. Plainmark must generate sound input for these editors but cannot override their paste preferences or internal document models.

## 3. Element contract

| Element | Preview requirement | Clipboard HTML requirement | Plain-text requirement |
|---|---|---|---|
| Headings | Preserve `h1`-`h6`; clearly descending scale; stable section spacing; long text wraps | Preserve the same heading level with portable font size, weight, color, and margins | Preserve text with blank-line separation; optional readable heading markers are acceptable |
| Paragraphs | Comfortable line height and measure; consistent vertical rhythm; long tokens wrap safely | Use `<p>` with a safe font stack, line height, text color, and margins | Paragraph text separated by blank lines |
| Strong/emphasis/deletion | Visually distinct without changing document flow | Preserve `<strong>`, `<em>`, and `<del>` | Preserve the words; deletion may use readable strike markers only if needed |
| Lists | Preserve ordered/unordered semantics, nesting, markers, and task state; avoid excessive mobile indentation | Preserve `<ol>`, `<ul>`, and `<li>` nesting with portable indentation and margins | Use bullets, numbers, indentation, and `[ ]`/`[x]` for tasks |
| Blockquotes | Use a restrained left border, inset spacing, and readable contrast | Preserve `<blockquote>` with a simple border, padding, and margins | Prefix lines with `>` |
| Inline code | Distinct monospaced treatment; wrap long tokens without breaking the page | Preserve `<code>` with a portable monospace stack and restrained background/border | Preserve the exact code text inline |
| Code blocks | Preserve all whitespace and line breaks; scroll horizontally at the block level | Preserve `<pre><code>` and whitespace; use simple background, border, padding, and monospace styling | Preserve code exactly, including indentation and line breaks |
| Tables | Preserve header cells, alignment, row/column relationships, and captions when present; table wrapper scrolls horizontally | Use real `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>` elements with collapsed borders and cell padding | Separate cells with tabs and rows with newlines so spreadsheet paste remains usable |
| Links | Clearly identifiable, keyboard reachable, safe, and able to wrap | Preserve safe absolute `http`/`https` links and visible labels; do not depend on hover styling | Output `label (URL)` when the label differs from the URL |
| Images | Responsive, never wider than their container, with useful alt text and a stable fallback | Include only a safe, durable source that the destination can resolve; preserve alt text | Output the alt text and source URL when useful |
| Horizontal rules | Provide restrained section separation | Preserve `<hr>` with a simple border | Use a short textual divider only when it improves readability |
| Unsupported embeds | Never execute scripts or break layout; show readable fallback content or a safe link | Omit scripts, iframes, event handlers, and application-only markup; preserve a safe link/label where possible | Preserve a readable label and safe URL where available |

## 4. Preview presentation rules

### 4.1 Typography and rhythm

- Keep prose within a comfortable reading measure on desktop while allowing tables and code to use contained overflow regions.
- Use one consistent document font stack and one monospace stack.
- Derive heading spacing from hierarchy: a new major section receives more space than a subsection.
- Avoid margin collapse surprises by defining the document flow deliberately in `markdown.css`.
- The first child should not receive unnecessary top margin; the last child should not create excessive trailing space.
- Adjacent lists, blockquotes, tables, code blocks, and paragraphs must maintain a predictable vertical rhythm.

### 4.2 Overflow and responsiveness

- The page itself must not scroll horizontally at supported widths.
- Tables and fenced code blocks own their horizontal scrolling.
- Long URLs, filenames, inline code, and unbroken strings use safe wrapping such as `overflow-wrap: anywhere` where appropriate.
- Code blocks preserve whitespace and scroll rather than visually compressing the code.
- Images use `max-width: 100%` and `height: auto`.
- On narrow screens, reduce page padding and list indentation before reducing text to an unreadable size.

### 4.3 Visual hierarchy

- Do not rely on color alone to distinguish elements.
- Headings require size/weight differences; links require an underline or another non-color cue; blockquotes require structure such as a border and inset.
- Table headers remain distinguishable from body cells.
- Inline code must not be confused with a link or status badge.
- Syntax highlighting is optional. Legible code, preserved whitespace, and adequate contrast are required.

## 5. Clipboard output contract

The **Copy document** action writes one clipboard item with the richest supported representations:

- `text/html`: portable semantic HTML for rich-text destinations.
- `text/plain`: an element-aware readable serialization.
- `text/markdown`: the unchanged source file when the browser supports this type.

The action never copies the application header, sidebar, filename toolbar, buttons, toast messages, or other UI chrome.

### 5.1 Portable HTML rules

Clipboard HTML must:

- Use standard semantic elements rather than recreating the page with generic `<div>` elements.
- Apply only essential inline presentation: safe font stacks, font size/weight, line height, text/background color, margin, padding, border, table alignment, and code whitespace.
- Use simple document flow. Do not depend on Tailwind classes, CSS variables, linked stylesheets, flexbox/grid layout, pseudo-elements, animation, JavaScript, or browser-only controls.
- Preserve the source order and nesting of content.
- Remove unsafe elements, event attributes, scripts, stylesheets, application data attributes, and controls added only for preview behavior.
- Prefer broadly supported CSS values and absolute safe URLs.

Do not copy every computed browser style. A small explicit export style map is more predictable, smaller, and easier to test.

### 5.2 Plain-text serialization

Plain text must be derived from document semantics rather than raw `textContent` alone. The serializer must preserve meaningful line breaks, list markers and nesting, blockquote prefixes, code whitespace, and tab/newline table structure.

### 5.3 Images and embedded content

Image copying is best-effort because clipboard consumers may strip remote images, refuse cross-origin resources, or fetch the image independently after paste.

For v1:

- Do not fetch remote image URLs automatically in the privacy-first preview. Show useful alt text and a safe external link instead; a future explicit-consent option may enable remote loading.
- Do not copy temporary browser `blob:` URLs; they will not survive outside the current page.
- Do not fetch or embed remote image bytes merely to improve paste fidelity.
- Do not execute or copy scripts, iframes, interactive embeds, or raw event handlers.
- Preserve safe alt text and a safe source link when an image cannot be represented reliably.
- Relative local images cannot be resolved from a single uploaded Markdown file unless the user explicitly grants the related files; multi-file asset handling remains future scope.

### 5.4 Destination expectations

| Destination | Expected result | Accepted limitation |
|---|---|---|
| Microsoft Word / Word Online | Editable headings, paragraphs, lists, tables, links, blockquotes, and code with useful source formatting | Word paste settings may merge or remove formatting; exact fonts and pagination are not controlled by Plainmark |
| Google Docs | Editable document hierarchy and common rich formatting | Google Docs may normalize font, margins, code styling, and table details |
| Notion | Content converted into headings, paragraphs, lists, tables, links, and code-like blocks where supported | Notion uses its own block model and intentionally discards complex styling |
| Plain-text editor | Complete readable content without HTML tags | Rich formatting is unavailable by definition |
| Spreadsheet | Semantic HTML tables or tab-delimited plain text can map to cells | A mixed full document is not expected to become a structured spreadsheet |

## 6. Maintainable implementation boundary

Use one parsing baseline and keep presentation-specific work separate:

```text
Markdown source
      │
      ├── semantic React renderers ──> preview HTML + markdown.css
      │
      ├── portable HTML serializer ──> text/html + inline export styles
      ├── plain-text serializer ─────> text/plain
      └── unchanged source ──────────> text/markdown when supported
```

Recommended modules:

```text
src/features/markdown/
├── markdown-document.jsx
├── markdown-components.jsx
└── markdown.css

src/lib/clipboard/
├── serialize-html.js
├── serialize-plain-text.js
├── export-styles.js
└── write-document-clipboard.js
```

Serializer functions should be deterministic and independently testable. Clipboard capability detection and browser writes belong in `write-document-clipboard.js`, not inside Markdown components.

## 7. Accessibility and safety

- Preserve heading levels; do not choose heading tags for appearance alone.
- Keep table header semantics and scopes where the parser exposes them.
- Images require meaningful alt text when provided; empty alt is appropriate only for genuinely decorative images.
- Links must reject dangerous schemes such as `javascript:`.
- Raw Markdown HTML remains disabled unless a maintained allowlist sanitizer is intentionally added.
- Code and tables must remain keyboard-scrollable when they overflow.
- Clipboard feedback must be announced without moving focus.

## 8. Acceptance and validation matrix

Use a fixture containing every required element and the representative open test case.

For preview validation, verify:

- Desktop, mobile, 200% zoom, keyboard navigation, long URLs, long code lines, deeply nested lists, wide tables, missing image sources, and malformed Markdown.
- No content is clipped, overlapped, hidden, or responsible for page-level horizontal overflow.

For copy validation, paste the full fixture into:

1. Microsoft Word or Word Online using normal paste / Keep Source Formatting.
2. Google Docs using normal paste.
3. Notion using normal paste.
4. A plain-text editor.

Confirm content completeness and semantic readability for headings, paragraphs, emphasis, lists, blockquotes, links, tables, inline code, and code blocks. Record destination-specific deviations rather than adding brittle editor-specific markup.

## 9. Deferred refinements

The following do not block v1:

- Pixel-identical typography or spacing after paste.
- Exact syntax-highlight colors in copied code.
- Matching browser line wraps or page width in another editor.
- Embedded image-byte copying.
- Editor-specific clipboard formats.
- DOCX, PDF, or image export.
- Interactive embeds, Mermaid rendering, or multi-file relative assets.

## 10. Reference behavior

- [Clipboard API specification](https://www.w3.org/TR/clipboard-apis/) — one clipboard item can expose multiple representations.
- [MDN `ClipboardItem`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardItem) — browser API, capability, and secure-context behavior.
- [Microsoft Word paste formatting](https://support.microsoft.com/en-us/word/control-the-formatting-when-you-paste-text) — Keep Source Formatting, Merge Formatting, and Keep Text Only.
- [Google Docs Markdown behavior](https://support.google.com/docs/answer/12014036) — Markdown paste/import support and conversion behavior.
- [Notion import behavior](https://www.notion.com/help/import-data-into-notion) — supported HTML/Markdown structures and formatting limitations.
