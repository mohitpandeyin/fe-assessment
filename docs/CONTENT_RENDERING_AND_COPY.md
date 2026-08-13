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
| Blockquotes | Use a restrained left border, inset spacing, and readable contrast | Preserve semantic `<blockquote>` nesting; repeat the portable left border, inset, line height, and zero paragraph margins on its direct paragraph/list blocks so Word and Docs retain the treatment | Prefix lines with `>` |
| Inline code | Distinct monospaced treatment; wrap long tokens without breaking the page | Preserve `<code>` with a portable monospace stack and restrained background/border | Preserve the exact code text inline |
| Code blocks | Preserve all whitespace and line breaks; show the declared-language label as read-only metadata, restrained local syntax highlighting where supported, per-block copy, and contained keyboard/pointer overflow | Preserve `<pre><code>` and whitespace plus normalized Notion language metadata; remove preview toolbar/highlight markup and place the semantic code inside a portable rectangular container whose background, border, and padding survive document-editor paste more reliably | Preserve code exactly, including indentation and line breaks; omit preview toolbar labels/actions |
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
- Code blocks preserve whitespace and scroll rather than visually compressing the code; focused code/table regions support Arrow Left/Right and Home/End.
- Images use `max-width: 100%` and `height: auto`.
- On narrow screens, reduce page padding and list indentation before reducing text to an unreadable size.

### 4.3 Visual hierarchy

- Do not rely on color alone to distinguish elements.
- Headings require size/weight differences; links require an underline or another non-color cue; blockquotes require structure such as a border and inset.
- Table headers remain distinguishable from body cells.
- Inline code must not be confused with a link or status badge.
- Syntax highlighting is optional. Legible code, preserved whitespace, and adequate contrast are required.
- Syntax highlighting uses the declared fence language only, a restrained accessible palette, and a curated local language set; no remote service, language selector, editing, or automatic guessing is permitted.
- Supported fence aliases normalize to Notion's language values and remain attached to the semantic `<pre><code>` output through `language-*`, `data-language`, and `data-code-language` metadata.
- Portable code HTML uses one presentation cell for the block background, border, and padding. Its semantic `<pre><code>` contains one inline, zero-margin `pre-wrap` run with the exact source text and literal newlines. Avoiding per-line block runs prevents Google Docs paragraph gaps while preserving line breaks in Word and Notion.
- Missing or unsupported declared languages remain readable and use Notion's `plain text` fallback.

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

#### Blockquote portability decision

The destination screenshots showed that content and emphasis survived, but Word and Google Docs discarded the border and inset attached only to `<blockquote>`. Both destinations then treated the child paragraphs as ordinary document paragraphs, so the global paragraph after-spacing made the quote look loose and disconnected. Notion, by contrast, recognized the semantic outer and nested blockquotes correctly.

Word and Google Docs both model indentation, before/after spacing, line spacing, borders, and shading as paragraph properties. The portable export therefore keeps the semantic `<blockquote>` tree but applies the visual fallback to the units those editors actually import: each direct paragraph, list, and nested blockquote receives the same left border, controlled inset, `1.5` line height, and zero margin. Lists receive a larger left inset so their bullets remain inside the quote. Adjacent segments share the same border position, producing one continuous visual rule without converting the quote to a table.

No blockquote background is exported. A fill is not required for recognition and is more likely to become fragmented paragraph shading or character highlighting during paste. The muted text color, left rule, indentation, and compact internal rhythm provide sufficient hierarchy. Nested quotes retain both semantic levels: the nested blockquote participates in the outer rule and its own child paragraphs receive a second inset rule.

This normalization is intentionally scoped to elements whose direct parent is a blockquote. Ordinary paragraphs, lists, tables, headings, code blocks, and preview styles are unchanged. Regression coverage must assert preserved `<blockquote>` nesting, paragraph/list border and spacing properties, readable list indentation, and untouched normal paragraph/list styles.

Hard-break and trailing-space handling follows the same paragraph-model rule. A Markdown hard break already becomes `<br>`; any parser formatting newline immediately after it is removed from the rich HTML clone so Word and Docs do not render an extra leading space on the next visual line. Because those editors may discard the outer blockquote margin, the final direct segment of an outer quote owns one normal `16px` bottom margin. Nested quote segments do not receive this external gap, and the following ordinary paragraph keeps its existing style.

#### Element portability refinements

The complete-document screenshots also exposed several smaller importer-specific gaps that can be addressed without changing Markdown semantics:

- Headings keep their original `h1`–`h6` elements and explicitly reset inherited italic and underline decoration. Conservative page-break hints are included as best-effort metadata; they never replace headings with manual page breaks.
- Task checkboxes are converted to readable `[x]` / `[ ]` text. Only the corresponding task list items suppress their native list marker, preventing a duplicate bullet while leaving ordinary and nested non-task lists unchanged.
- A standalone unavailable-image fallback is represented by one styled paragraph rather than a styled inline span inside an ordinary paragraph. The paragraph owns one background, border, padding region, and line height; its label, alt text, and validated source link remain readable and separated. No remote image is fetched.
- Nested blockquotes keep their semantic tree. Their directly imported paragraph/list segments use a slightly darker rule so the second level remains distinguishable when Word or Google Docs drops container-only styling.
- Real table sections are preserved. `<thead>` receives only conservative header-group and pagination hints; the exporter does not flatten tables, force column widths, prevent all row splitting, or attempt to make a very wide matrix fit a portrait page.
- Inline code remains a semantic inline `<code>` run. It uses explicit character `background-color` rather than the broader background shorthand so Word has a better chance of importing the shading, while inherited line height and safe wrapping prevent the run from disturbing its surrounding paragraph. Fenced code continues to use its separate block normalization.

The follow-up destination paste confirmed that Word Online still discards the inline-code background, border, radius, and padding while preserving the monospace font, exact text, inline position, and wrapping. Google Docs retains the light background. Word's monospace-only result is accepted: presentation tables, block wrappers, or proprietary highlight markup would be disproportionate for character-level code and could regress Docs or Notion.

These refinements are local to the rich HTML clone. They do not modify preview styling, plain-text output, exact Markdown, ordinary document elements, or the already-validated code-block representation. Automated tests verify the generated structure; Word/Google Docs/Notion paste behavior remains a separate manual acceptance gate.

#### Code-block compatibility postmortem

The Notion language metadata was not the cause of the code-line regression. The regression was introduced while changing the internal code markup to make the visual container portable across rich-text destinations.

The three destinations interpret clipboard HTML differently:

- Google Docs may map block-level children and `<br>` elements inside preformatted content to paragraph-like boundaries. If every source line is exported as a block run, Docs can add paragraph spacing between lines and can apply the background to separate text fragments instead of one block.
- Word preserves literal newline characters inside a preformatted text run, but CSS-only line breaks such as `display:block` on per-line spans are not reliable paste semantics. Removing the newline characters while relying on those spans caused Word to join the code.
- Notion uses the semantic `<pre><code>` element and its language metadata, but it also needs the code payload to retain literal newline characters. Visual block boundaries do not replace those characters, so the same flattened payload caused Notion to join the code.

We diagnosed this by comparing the destination screenshots with the serialized `text/html`, then separating two concepts that initially looked equivalent in the browser: a **visual line break** created by layout CSS and an **actual code newline** represented by `\n` in the text node. Intermediate versions used `<br>` elements or one block-level element per source line. Those structures looked correct in a browser but allowed Google Docs to introduce paragraph spacing, and the per-line version no longer gave Word or Notion one text payload containing the source newlines.

The portable representation therefore follows these invariants:

- One presentation cell owns the background, border, and padding for the complete block. Background is never applied per source line.
- The semantic `<pre><code>` structure and normalized Notion language metadata remain intact.
- The code element contains one inline, zero-margin run with `white-space: pre-wrap` and the exact source text, including every intentional newline and blank line.
- The serializer does not create `<br>` elements or block-level elements for individual code lines.
- The content run uses controlled line height and safe wrapping; the fixed-layout presentation table keeps the container within the document width.

Regression tests must assert the structure as well as its appearance: one presentation cell, one code-content run, no `<br>` elements, exact `textContent` including indentation/newlines/intentional blank lines, and no change to ordinary Markdown tables or other document elements. This is the smallest representation that gives Google Docs one connected box without paragraph gaps while preserving the source line structure in Word and Notion.

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

The deliberately complex regression fixture is `public/sample-file.md`. It covers every heading level, mixed/nested/task lists, ten code blocks, four table profiles, multilingual and Unicode content, remote/local/unsafe media cases, long URLs/tokens/code, optional syntax degradation, and parser-boundary inputs. The home screen exposes this same fixture through the underlined **Sample File.** download link.

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
- [Microsoft Word paragraph indentation and spacing](https://support.microsoft.com/en-us/word/adjust-indents-and-spacing-in-word) — indentation plus before/after spacing are paragraph properties.
- [Microsoft Word paragraph borders](https://support.microsoft.com/en-us/word/add-a-border-to-some-text-in-word) — borders and shading can be applied to complete paragraphs.
- [Google Docs Markdown behavior](https://support.google.com/docs/answer/12014036) — Markdown paste/import support and conversion behavior.
- [Google Docs paragraph formatting](https://support.google.com/docs/answer/1663349) — line/paragraph spacing, borders, shading, and paragraph padding behavior.
- [Google Docs document structure](https://developers.google.com/workspace/docs/api/concepts/structure) — paragraph formatting owns borders and indentation in the Docs model.
- [Notion import behavior](https://www.notion.com/help/import-data-into-notion) — supported HTML/Markdown structures and formatting limitations.
