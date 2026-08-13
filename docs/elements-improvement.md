# Word and Google Docs element-improvement reference

Status: implementation reference; Phase B1 implemented locally  
Created: 2026-08-13  
Last implementation update: 2026-08-13

## 1. Purpose

This document audits the complete rich-paste output shown in the supplied Microsoft Word, Google Docs, and Notion screenshots. It defines what is already correct, what is controlled by the destination editor, and what should be tested or improved without regressing established behavior.

The primary targets are Microsoft Word / Word Online using normal paste or **Keep Source Formatting**, and Google Docs using normal paste. The Notion screenshot is a regression reference because it shows which semantic structures already convert correctly and therefore must not be replaced with presentation-only markup.

This is not an instruction to implement every possible visual refinement. Each recommendation is classified so that changes can be made independently and validated against the complete fixture.

## 2. Evidence reviewed

### 2.1 Screenshots

- Google Docs full-document capture, part 1: headings through consecutive mixed elements.
- Google Docs full-document capture, part 2: final mixed elements, parser boundaries, long-form prose, and completion record.
- Microsoft Word / Word Online full-document capture: the complete fixture across paginated pages.
- Notion full-document capture: semantic conversion baseline for headings, tasks, blockquotes, code, and tables.

The repeated Google Docs outline/sidebar visible beside successive page segments is a stitched-screenshot artifact caused by a fixed application panel. It is not duplicated document content.

Red spelling/grammar underlines in Word are proofing overlays. They are not exported borders, syntax highlighting, or content corruption and must not drive serializer changes.

### 2.2 Current implementation

- Portable styles: `src/lib/clipboard/export-styles.js`
- Rich HTML normalization and sanitization: `src/lib/clipboard/serialize-html.js`
- Semantic plain text: `src/lib/clipboard/serialize-plain-text.js`
- Preview components: `src/features/markdown/markdown-components.jsx`
- Complete fixture: `requirements/complex_rendering_test.md`
- Existing contract: `docs/CONTENT_RENDERING_AND_COPY.md`

### 2.3 Authoritative platform references

#### Microsoft Word

- [Control formatting when pasting](https://support.microsoft.com/en-us/word/control-the-formatting-when-you-paste-text)
- [Use styles in Word for the web](https://support.microsoft.com/en-us/word/use-styles-in-word-for-the-web)
- [Add a heading](https://support.microsoft.com/en-us/word/add-a-heading-in-a-word-document)
- [Adjust paragraph indentation and spacing](https://support.microsoft.com/en-us/word/adjust-indents-and-spacing-in-word)
- [Keep text and headings together](https://support.microsoft.com/en-us/word/keep-text-together-in-word)
- [Define multilevel lists](https://support.microsoft.com/en-us/word/define-new-bullets-numbers-and-multilevel-lists)
- [Adjust list indentation](https://support.microsoft.com/en-us/word/change-bullet-indents-in-word)
- [Resize and AutoFit tables](https://support.microsoft.com/en-us/word/resize-a-table-column-or-row)
- [Set table properties and row pagination](https://support.microsoft.com/en-us/office/set-or-change-table-properties-3237de89-b287-4379-8e0c-86d94873b2e0)
- [Repeat table headers](https://support.microsoft.com/en-us/word/repeat-table-header-on-subsequent-pages)
- [Create accessible links](https://support.microsoft.com/en-us/accessibility/word/use-a-screen-reader-to-insert-a-hyperlink-in-word)
- [Word accessibility guidance](https://support.microsoft.com/en-us/accessibility/word/make-your-word-documents-accessible-to-people-with-disabilities)

#### Google Docs

- [Create and customize headings](https://support.google.com/docs/answer/116338)
- [Paragraph spacing, pagination, borders, shading, and padding](https://support.google.com/docs/answer/1663349)
- [Create and edit lists and checklists](https://support.google.com/docs/answer/3300615)
- [Add and edit tables](https://support.google.com/docs/answer/1696711)
- [Google Docs document structure](https://developers.google.com/workspace/docs/api/concepts/structure)
- [Google Docs document resource and paragraph properties](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents)
- [Accessibility guidance for headings, tables, links, contrast, and alt text](https://support.google.com/docs/answer/6199477)
- [Code blocks and other Docs structures with a screen reader](https://support.google.com/docs/answer/1632201)

## 3. Cross-platform principles

1. Preserve semantic HTML first. Word and Docs may normalize presentation, but headings, lists, tables, links, and blockquotes must remain editable document structures.
2. Prefer paragraph properties for paragraph-like content. Both platforms model indentation, spacing, line-height, borders, and shading primarily at paragraph level.
3. Use tables only for tabular data, except for the already-validated code-block compatibility container. Do not introduce layout tables for headings, prose, quotes, lists, or media fallbacks.
4. Do not use visual CSS breaks as a substitute for meaningful text or paragraph structure.
5. Do not apply global changes to solve a local problem. Dense tables, task lists, media fallbacks, blockquotes, and code each require isolated selectors or normalization.
6. Treat pagination as a document concern. Avoid manual page breaks; test `keep-with-next`, widow/orphan control, header repetition, and row splitting only where supported.
7. Do not optimize a portrait-page screenshot by destroying editability or semantics. Extremely wide data cannot be made comfortably readable in a portrait Word/Docs page through generic clipboard HTML alone.
8. Preserve established Notion behavior. Do not replace semantic blockquotes, task structures, code metadata, or data tables with visual-only constructs.

## 4. Priority summary

| Priority | Meaning | Elements |
|---|---|---|
| P0 — protect | Working behavior; add regression coverage before adjacent changes | Semantic headings/outline, ordinary prose, emphasis, links, code text/newlines, code container, compact tables, sanitization, parser degradation |
| P1 — validate next | Clear screenshot gap with a small scoped candidate | Lower-level heading resets, heading pagination, task-list markers, media fallbacks, table header/first-row pagination, nested blockquote distinction |
| P2 — experiment carefully | Potential improvement with destination tradeoffs | Nested ordered-list markers, dense/wide table profile, long-cell column balance, bidirectional text hints |
| P3 — accepted limitation | Destination/page constraint or expected source behavior | Word proofing marks, stitched Docs sidebar, unavoidable portrait width limits, source paragraph continuing inside a list item, exact font/pagination matching |

### 4.1 Phase B1 implementation status

The first approved implementation pass intentionally covers only small, isolated P1 changes:

- `h1`–`h6` remain semantic and now explicitly reset inherited italic/underline styling. They also carry non-destructive `page-break-after` / `break-after` hints so compatible importers may keep a heading with its next block.
- Task inputs still become portable `[x]` / `[ ]` text, but only task `<li>` elements suppress the redundant native bullet. Ordinary list items retain their markers and spacing.
- A standalone unavailable-image fallback is promoted to one styled paragraph with a single background, border, padding region, readable separators, and its validated source link. No image bytes are fetched.
- Nested blockquote segments retain semantic nesting and use a slightly darker rule than the outer quote, without changing normal paragraphs or lists.
- Semantic table headers retain `<thead>` and now include conservative header-group/pagination hints. No dense-table reflow, column sizing, row-splitting policy, or layout-table conversion was added.

Automated serializer coverage verifies the emitted structure and confirms that ordinary headings, lists, paragraphs, links, and table rows outside these targets are not rewritten. These checks validate the exporter input, not destination compliance: the full fixture must still be pasted into Word, Google Docs, and Notion before the recommendations can be marked destination-approved.

The subsequent full-document screenshots confirmed the heading, task, media-fallback, and code-block improvements in Word and Google Docs. They also showed that Word retained inline code as monospace text but dropped both the previous shorthand background and the follow-up explicit `background-color`. Google Docs retained the background and safe wrapping. Monospace-only inline code in Word is therefore an accepted destination limitation; no proprietary wrapper or highlighting hack will be added.

## 5. Element-by-element audit

### 5.1 Document root, page width, and default typography

**Current behavior**

- Both Word and Google Docs produce an editable paginated document with a consistent central text measure.
- Google Docs normalizes the body to its document font/size controls; Word similarly applies its active document theme and style system.
- The screenshots show readable body text and no page-level horizontal overflow outside very wide tables.

**Word behavior/guidelines**

- Word paste can keep source formatting, merge formatting, or keep text only. Default paste usually retains as much source formatting as Word can map.
- Word styles own font, size, color, paragraph alignment, spacing, borders, and shading. Page width and pagination remain destination-controlled.

**Google Docs behavior/guidelines**

- Docs paragraph styles control typography and paragraph behavior. It normalizes imported fonts, sizes, line spacing, and page layout to its document model.
- Page-mode and pageless-mode behavior differ; pagination controls are only meaningful in page mode.

**What we currently do**

- The exported root uses Arial/Helvetica, `16px`, `1.65` line-height, dark text, and a maximum width of `860px`.
- Individual elements receive explicit inline styles, while the destination owns the page.

**Identified gap/improvement**

- No root-level defect is visible. A global font-size or line-height change would create broad regression risk and may still be normalized by the destination.

**Recommended approach**

- P0: keep the root style unchanged.
- Evaluate future typography changes only against normal prose, nested lists, tables, and code in both editors.

**Expected output**

- A readable editable document whose exact font and pagination can vary by destination without losing hierarchy or content.

**Platform-specific considerations**

- Do not infer an export defect from a toolbar font value alone; it reflects the destination's selected paragraph/style.
- Validate both Word's default/Keep Source Formatting paste and Google Docs normal paste.

### 5.2 Document title and heading levels 1–6

**Current behavior**

- Word and Google Docs recognize the heading hierarchy and populate navigation/outline surfaces.
- H1–H3 are visually clear in both screenshots.
- In Word, lower levels inherit recognizable Word theme characteristics: the level corresponding to “Decision quality” appears italic and the next level appears underlined. This weakens consistency with the intended all-upright hierarchy.
- Some headings can be left at the bottom of a page while the following code block or paragraph begins on the next page, as seen around the Python section in Google Docs.

**Word behavior/guidelines**

- Microsoft recommends built-in heading styles because they support navigation, reorganization, accessibility, and tables of contents.
- Word heading styles can carry font style, decoration, spacing, and keep-with-next behavior from the destination theme.

**Google Docs behavior/guidelines**

- Docs Heading 1–6 styles drive the document outline and can be customized consistently.
- Docs supports **Keep with next**, **Keep lines together**, and single-line prevention in page mode.

**What we currently do**

- Semantic `h1`–`h6` elements are preserved.
- Each level sets size, weight, color, line-height, and margins, but does not explicitly reset `font-style` or `text-decoration`.

**Identified gap/improvement**

- P1: Word theme styling can make H4–H6 italic or underlined despite the intended hierarchy.
- P1: orphaned headings reduce page readability.

**Recommended approach**

- Preserve `h1`–`h6` semantics.
- Test explicit `font-style: normal` and `text-decoration: none` on all exported headings, especially H4–H6.
- Separately test `page-break-after: avoid`, `break-after: avoid`, and the narrowest supported Word pagination hint. Keep the rule only if both platforms improve and long blocks do not create excessive blank pages.
- Do not insert manual page breaks.

**Expected output**

- All six levels remain in the Word navigation pane and Google Docs outline, use a consistent upright hierarchy, and stay with at least the first following paragraph/block where the destination honors the hint.

**Platform-specific considerations**

- Word may prefer its built-in heading appearance over some inline declarations.
- Docs may ignore imported keep-with-next CSS even though the feature exists in its native paragraph model; manual destination verification is mandatory.

### 5.3 Body paragraphs and long-form reading

**Current behavior**

- The long-form sample is readable in both editors, with reasonable line length and paragraph separation.
- Word appears somewhat denser than Google Docs because the editors normalize line and paragraph spacing differently.
- No accidental empty paragraphs or duplicated prose are visible.

**Word behavior/guidelines**

- Word separates line spacing from before/after paragraph spacing and can adjust paragraph spacing during paste.
- Widow/orphan control and keep-lines-together are native paragraph properties.

**Google Docs behavior/guidelines**

- Docs exposes line spacing, before/after paragraph spacing, keep-lines-together, keep-with-next, and single-line prevention in page mode.

**What we currently do**

- Paragraphs use `margin: 0 0 16px`; the root supplies `1.65` line-height.

**Identified gap/improvement**

- No visual defect justifies changing all paragraphs.
- P2: widow/orphan behavior could be tested for long prose, but generic HTML paste may not preserve it.

**Recommended approach**

- P0: keep normal paragraph spacing unchanged.
- If pagination hints are explored, add them independently from typography changes and validate the long-form section across page boundaries.

**Expected output**

- Comfortable reading rhythm with real paragraphs, no `<br>`-based spacing, and editor-controlled pagination.

**Platform-specific considerations**

- Exact page count and line wrap are not portable guarantees.

### 5.4 Strong, emphasis, nested emphasis, and deletion

**Current behavior**

- Bold, italic, nested emphasis, and strikethrough remain visible in both editors.
- The final mixed sentence preserves nested combinations.
- Word proofing may underline technical words independently of emphasis styling.

**Word behavior/guidelines**

- Word retains character-level emphasis under Keep Source Formatting and usually under Merge Formatting.

**Google Docs behavior/guidelines**

- Docs imports standard bold, italic, underline, and strikethrough character formatting.

**What we currently do**

- Semantic `strong`, `em`, and `del` are preserved. `strong` receives explicit weight; `del` receives muted color and line-through.

**Identified gap/improvement**

- No gap is visible.

**Recommended approach**

- P0: preserve current semantic elements and restrained color.
- Do not replace nested emphasis with flattened styled spans.

**Expected output**

- Editable text with every intended emphasis combination intact.

**Platform-specific considerations**

- Spellcheck/grammar marks are not part of the exported presentation.

### 5.5 Hyperlinks, email links, and raw long URLs

**Current behavior**

- Safe links remain active, green, and underlined in both editors.
- Descriptive labels and inline emphasis inside labels survive.
- Raw long URLs wrap within the page. In narrow table columns they can break aggressively, which is addressed with table layout rather than global link styling.
- Local/unsafe links degrade to inert readable text; `mailto:` remains usable.

**Word behavior/guidelines**

- Word supports links to web pages and email and recommends descriptive link text for accessibility.
- Paste and destination link styles may recolor links.

**Google Docs behavior/guidelines**

- Docs supports editable hyperlinks and accessibility guidance favors meaningful labels rather than exposed URLs when a descriptive label exists.

**What we currently do**

- Only validated anchor, direct, and external URLs retain `href`.
- Links use an explicit color plus underline so recognition does not rely on color alone.
- Unsafe and unresolved relative links are unwrapped to readable text.

**Identified gap/improvement**

- No global link change is required.
- P2: table-column balance is poor for link-heavy cells, but changing every link would regress normal prose.

**Recommended approach**

- P0: retain current URL safety and accessible link treatment.
- Address table links only in the dense/long-cell table profiles.

**Expected output**

- Safe, editable, recognizable links with descriptive labels; unsafe addresses remain inert.

**Platform-specific considerations**

- Destination theme colors may override green while preserving hyperlink behavior.
- Do not preserve `target` or application-specific link attributes.

### 5.6 Inline code and long inline-code expressions

**Current behavior**

- Inline code remains monospaced in both editors. Google Docs retains the light character background, while the supplied Word Online screenshot preserves the font but drops the background/border treatment.
- Long inline-code tokens wrap and stay within page width.
- A wrapped inline code background can appear as separate line fragments; this is expected for an inline element and differs from the code-block requirement for one connected background.

**Word behavior/guidelines**

- Word does not provide a universal semantic inline-code style during HTML paste; monospace font and direct formatting are the portable representation.

**Google Docs behavior/guidelines**

- Docs can represent inline character formatting; its native code building block is a separate block-level feature and is not an inline-code contract.

**What we currently do**

- Inline code uses a portable monospace stack, `0.9em`, an explicit `background-color`, restrained border/padding, inline flow, inherited line height, and safe wrapping.

**Identified gap/improvement**

- Word Online dropped the previous `background` shorthand during HTML import, leaving only the monospace distinction.
- Avoid trying to make wrapped inline code look like one connected rectangle; character shading should follow the text fragments naturally.

**Recommended approach**

- Keep explicit `background-color` for Google Docs and other compatible destinations while preserving semantic `<code>` and inline flow.
- Keep inline code independent from fenced code normalization and do not introduce a table/span wrapper.
- Accept monospace-only inline code in Word Online after the follow-up paste confirmed that standard character background styling is discarded.

**Expected output**

- Compact monospaced inline text with a restrained light character background where the destination accepts it, wrapping without widening the page or altering the surrounding paragraph line height.

**Platform-specific considerations**

- Word Online drops background, border radius, border, and exact padding in the supplied paste result. Monospace text, exact content, inline flow, and readable wrapping are the Word acceptance criteria.
- Google Docs may show separate background fragments when an inline code run wraps. That is correct inline behavior, not a fragmented code block.

### 5.7 Horizontal rules

**Current behavior**

- Horizontal rules appear as restrained full-width separators with useful vertical space in both editors.

**Word behavior/guidelines**

- Word may represent a horizontal rule as a paragraph border. This remains editable but is destination-controlled.

**Google Docs behavior/guidelines**

- Docs supports horizontal lines and paragraph borders; imported rules may be normalized to either model.

**What we currently do**

- Semantic `hr` uses a neutral `1px` top border and `28px` vertical margin.

**Identified gap/improvement**

- No gap is visible.

**Recommended approach**

- P0: keep the current rule. Do not simulate separators with repeated underscores or empty paragraphs.

**Expected output**

- A subtle section separator that does not appear in the document outline.

**Platform-specific considerations**

- Exact line color and spacing may follow the destination theme.

### 5.8 Unordered, ordered, mixed, and deeply nested lists

**Current behavior**

- Both editors preserve list structure, nesting, and source order.
- Word assigns distinct bullet/number styles by depth and shows alphabetic/Roman numbering for nested ordered levels.
- Google Docs preserves indentation but often repeats decimal `1.` markers at nested ordered levels, making depth less scannable.
- Extremely deep lists remain narrow but readable; indentation consumes significant page width as expected.

**Word behavior/guidelines**

- Word supports multilevel lists, per-level number styles, bullet styles, and separate bullet/text indentation.

**Google Docs behavior/guidelines**

- Docs supports nested bulleted/numbered lists, per-level indentation, checklist types, numbering restart, and continuation.

**What we currently do**

- Semantic `ol`, `ul`, and `li` nesting is preserved.
- Lists use `28px` left padding, `18px` bottom margin, and `4px` item margins.
- No explicit per-depth `type` or `list-style-type` is exported.

**Identified gap/improvement**

- P2: nested ordered levels are less distinguishable in Google Docs.
- Global indentation reduction could damage readable hierarchy and is not justified.

**Recommended approach**

- Preserve semantic nesting.
- Experiment separately with safe `ol` `type` attributes or explicit list styles for only the first few nested ordered depths: decimal, lower-alpha, lower-Roman. Retain only if Google Docs improves and Word/Notion remain correct.
- Keep current indentation unless destination testing demonstrates a measurable overflow problem.

**Expected output**

- Nested list levels remain editable and visually distinct through indentation and, where portable, marker variation.

**Platform-specific considerations**

- Word for the web preserves basic lists but offers less fine-grained editing than desktop Word.
- Marker glyphs and numbering styles are destination-controlled and should not become literal text unless semantic list import fails.

### 5.9 Task lists and completion records

**Current behavior**

- Word and Google Docs show a normal list bullet plus `[x]`/`[ ]`, producing a visually redundant marker.
- Notion converts the same source into native checkbox blocks, which is already desirable.
- Nested task hierarchy and completion state survive.

**Word behavior/guidelines**

- Word does not expose a universal Markdown-task checkbox import through generic clipboard HTML. A text marker is a reliable editable fallback.

**Google Docs behavior/guidelines**

- Docs has a native checklist list type, but generic pasted HTML is not guaranteed to map disabled checkbox inputs to native checklist controls.

**What we currently do**

- Preview checkboxes are replaced with literal `[x]` or `[ ]` text before export while the enclosing semantic list remains.

**Identified gap/improvement**

- P1: duplicate bullet plus checkbox text is visually noisy.
- Any change must preserve nested indentation and Notion's native task conversion.

**Recommended approach**

- Mark task-containing list items before replacing inputs.
- Test a task-list-only `list-style-type: none` treatment with controlled indentation. Do not suppress markers on ordinary or mixed lists.
- Preserve the literal `[x]`/`[ ]` state as the lowest-common-denominator text.
- Verify whether Notion continues selecting the Markdown representation and creating native checkboxes.

**Expected output**

- Word and Docs show one checkbox-style marker per task, not a bullet plus marker; nesting remains obvious. Notion keeps native task blocks.

**Platform-specific considerations**

- Do not depend on disabled HTML `<input>` elements surviving sanitization or paste.
- Native Docs checklists would require destination-specific conversion that clipboard HTML alone may not reliably trigger.

### 5.10 Standard, nested, warning, and long-URL blockquotes

**Current behavior**

- The latest screenshots show a continuous left rule and compact paragraph rhythm for outer quotes in Word and Docs.
- The opening Word metadata quote revealed two remaining import artifacts: hard-break continuation lines gained one leading space, and the following ordinary paragraph touched the quote because Word discarded the container margin.
- The warning quote is visually distinct as a separate rule.
- Nested quote text is indented but its second semantic level is not consistently expressed as a clearly separate inner rule after paste.
- Notion correctly recognizes outer and nested semantic blockquotes.
- Long URLs remain contained inside quote paragraphs.

**Word behavior/guidelines**

- Word treats borders, indentation, line spacing, and shading as paragraph properties. Container-only web styles can be lost during paste.

**Google Docs behavior/guidelines**

- Docs exposes paragraph left borders, indentation, paragraph padding, line spacing, and shading. Adjacent paragraphs can visually share compatible border properties.

**What we currently do**

- Semantic `<blockquote>` nesting remains.
- Direct paragraphs, lists, and nested blockquotes receive a matching `3px` left border, `1.5` line-height, zero margin, and controlled padding.
- Formatting newlines immediately following `<br>` are removed from the rich HTML clone; the real `<br>` remains the only hard-break boundary.
- The last direct segment of an outer quote receives `16px` bottom margin so paragraph rhythm survives even when the destination drops the container margin.
- No background fill or layout table is used.

**Identified gap/improvement**

- P1: manually revalidate whether nested quotes retain a second rule in both platforms; the screenshot suggests indentation survives more reliably than the second rule.
- P1: verify the normalized hard-break alignment and post-quote margin in Word, Docs, and Notion.

**Recommended approach**

- Protect the current outer quote treatment.
- If the nested rule remains invisible, test a nested-only increased inset or darker second border without changing outer quote paragraphs.
- Keep warnings as readable blockquotes; do not infer specialized admonition semantics from `[!WARNING]` in v1.

**Expected output**

- One connected outer quote, aligned hard-break continuation lines, one normal paragraph gap after the quote, visually subordinate nested context, compact quoted lists, and contained long URLs.

**Platform-specific considerations**

- A background fill is intentionally avoided because Docs/Word may convert it to fragmented paragraph shading or text highlighting.
- Do not use a table wrapper because it would risk Notion's correct native quote conversion.

### 5.11 Fenced code blocks, language metadata, long lines, and pagination

**Current behavior**

- Both Word and Docs show one connected light rectangular container with border, padding, monospace text, and correct intentional line breaks.
- Long lines wrap within the page rather than widening it.
- Word proofing underlines many identifiers; this is not exported styling.
- Long code blocks can split across pages. The background continues as page fragments; this is preferable to deleting line breaks or forcing a large blank area.
- Notion recognizes code semantics and language metadata and applies its own highlighting.

**Word behavior/guidelines**

- Word preserves formatted text and table cells where possible, but it has no generic HTML guarantee for a native code-block object.
- Page flow may split long table content; keeping a large code table together can create severe pagination gaps.

**Google Docs behavior/guidelines**

- Docs has a native code-block building block, but normal pasted HTML is not guaranteed to become that structure. A portable preformatted container remains necessary.

**What we currently do**

- One presentation table cell owns background, border, and padding.
- Semantic `<pre><code>` and normalized Notion language metadata remain.
- One inline `pre-wrap` run contains exact source text and literal newlines.
- No per-line blocks or `<br>` elements are generated.

**Identified gap/improvement**

- No code-formatting change is recommended.
- Heading-to-code pagination belongs to the heading experiment, not code serialization.

**Recommended approach**

- P0: freeze the current code structure and regression tests.
- Do not add keep-together to every code block. A later experiment may avoid splitting only small blocks that fit comfortably on one page, but it must be opt-in and destination-tested.

**Expected output**

- Exact editable code with one connected visual block, stable indentation/newlines, safe wrapping, and accepted destination pagination.

**Platform-specific considerations**

- Never remove literal newlines in favor of CSS layout.
- Never apply background per code line.
- Proofing marks can be disabled by the user in Word but are outside Plainmark's output contract.

### 5.12 Compact data tables

**Current behavior**

- The compact decision table is structured, aligned, readable, and visually consistent in both editors.
- Header fill, borders, cell padding, and GFM alignment survive sufficiently.

**Word behavior/guidelines**

- Word supports AutoFit to contents/window, cell margins, borders, header rows, and flexible widths. Microsoft accessibility guidance recommends simple tables with headers and avoiding fixed widths.

**Google Docs behavior/guidelines**

- Docs supports column widths, row heights, cell padding, borders, fills, vertical alignment, and table headers.

**What we currently do**

- Real `table`, `thead`, `tbody`, `tr`, `th`, and `td` elements are preserved.
- Tables use collapsed borders, `14px` text, full available width, neutral header fill, and `9px 10px` cell padding.

**Identified gap/improvement**

- No compact-table defect is visible.

**Recommended approach**

- P0: preserve current compact-table behavior.
- Any dense-table change must be applied through an independently detected profile and must not alter compact tables.

**Expected output**

- An editable native-looking table with readable headers, alignment, and cell spacing.

**Platform-specific considerations**

- Do not introduce fixed column widths globally.

### 5.13 Wide operational matrices

**Current behavior**

- The 14-column matrix remains a real table with all values present.
- On portrait pages, both editors compress columns until many headers and values wrap one character or short fragment per line. Rows become several pages tall and difficult to scan.
- This is the largest unresolved readability limitation in the screenshots.

**Word behavior/guidelines**

- Word offers AutoFit Window and AutoFit Contents, flexible widths, explicit column sizing, repeating header rows, and row-break controls.
- Microsoft accessibility guidance discourages fixed-width tables and recommends simple structures with headers.

**Google Docs behavior/guidelines**

- Docs supports explicit column widths, cell padding, row overflow controls, and pinned header rows, but the page still provides finite width.

**What we currently do**

- Every table uses the same full-width, `14px`, `9px 10px` cell profile regardless of column count.
- No dense-table classification or destination-specific orientation exists.

**Identified gap/improvement**

- P2: the generic table profile is too spacious for a 14-column portrait table.
- No clipboard-only style can make this matrix fully comfortable on a portrait page without tradeoffs.

**Recommended approach**

- Detect wide tables by semantic structure, for example column count above a documented threshold, without adding application classes to ordinary output.
- Experiment with a dense profile: smaller but accessible font, substantially reduced cell padding, top alignment, normal word breaking for prose, and preserved header emphasis.
- Test whether removing forced `width: 100%` or using an AutoFit-friendly width improves Word and Docs; retain only if the table does not clip or exceed page bounds.
- Test header repetition/pinning hints and row splitting independently.
- If readability remains unacceptable, document the portrait-page limit and offer a future spreadsheet/landscape export rather than flattening or transposing the table silently.

**Expected output**

- All data remains editable and in the correct columns, with less character-by-character wrapping where possible. A truly wide matrix may still require user resizing, landscape orientation, or spreadsheet use.

**Platform-specific considerations**

- Word desktop has stronger AutoFit and landscape controls than Word Online.
- Docs cannot provide a horizontally scrolling native table in page mode.
- Never convert the table to an image or series of paragraphs during the normal rich-copy path.

### 5.14 Long text, inline code, and links inside table cells

**Current behavior**

- The interpretation column remains readable.
- The signal and investigation-link columns become extremely narrow; identifiers and links wrap character by character in both editors.
- The semantic table and links remain intact.

**Word behavior/guidelines**

- Word supports per-column widths, AutoFit, cell margins, and text wrapping, but imported HTML may not infer desirable proportions.

**Google Docs behavior/guidelines**

- Docs supports per-column width and cell padding. It does not automatically know that the middle prose column should receive most of the width.

**What we currently do**

- No column-width metadata is inferred from content or GFM source.
- Inline code and links retain global safe-wrapping rules.

**Identified gap/improvement**

- P2: equal/automatic allocation does not reflect content roles.

**Recommended approach**

- Build a separate long-cell-table experiment, not a global rule.
- Test proportional column hints derived from the header/content profile, for example a narrow identifier column, a dominant interpretation column, and a moderate link column.
- Keep link labels descriptive; do not expose full URLs when a label exists.
- Do not disable wrapping globally. A controlled break is better than page overflow.

**Expected output**

- The prose column remains dominant, identifiers wrap at sensible boundaries where possible, and link labels use several words per line rather than one character per line.

**Platform-specific considerations**

- Percentage/HTML column hints may be normalized differently. Validate Word and Docs separately before adopting them.

### 5.15 Table pagination, header rows, and row splitting

**Current behavior**

- Long tables split across pages.
- In at least one Word segment, a small table header appears at the bottom of one page while its data row begins on the next page.
- Wide-table rows split or continue across pages and the header is not consistently repeated in the screenshots.

**Word behavior/guidelines**

- Word can repeat the first row as a header on subsequent pages and can control whether a row breaks across pages.
- Word supports keeping related paragraphs together, but table pagination has separate row properties.

**Google Docs behavior/guidelines**

- Docs can pin/repeat table header rows and can allow or prevent a row from overflowing across pages.

**What we currently do**

- Semantic `thead` is preserved, but no explicit Word/Docs pagination hints are exported.

**Identified gap/improvement**

- P1: orphaned header rows and missing repeated headers reduce scanability.

**Recommended approach**

- Test standards-compatible and Word-safe header repetition hints on `thead`/header rows.
- Test keeping a table header with the first data row, especially for one-row tables.
- Do not disable row splitting globally: long rows could move entirely to the next page or exceed a page.
- For dense tables, prefer allowing long rows to split while repeating the header if supported.

**Expected output**

- A header never appears alone at a page bottom; multipage tables repeat a recognizable header where the destination supports it; oversized rows remain complete.

**Platform-specific considerations**

- Native UI features do not guarantee equivalent behavior from pasted HTML. Every pagination hint is experimental until verified in both destinations.

### 5.16 Images, remote media, local media, and unsafe embeds

**Current behavior**

- Remote/local image failures remain readable and provide a safe source link or explanation.
- In Word and Docs, the fallback appears largely as ordinary inline prose rather than the intended bordered, padded fallback component.
- Unsafe raw embeds are absent and do not execute.

**Word behavior/guidelines**

- Word accessibility guidance requires concise alt text for meaningful visuals and discourages tables used only for layout.
- Paragraph borders/shading are more portable than styling an inline wrapper as a block.

**Google Docs behavior/guidelines**

- Docs accessibility guidance requires alt text for visuals and recommends data tables only for data.
- Paragraph borders, shading, padding, and spacing are native document properties.

**What we currently do**

- `ImageFallback` renders a span containing a strong label, alt text, and safe link or reason.
- Portable styles attempt block display, background, border, margin, and padding on that span.
- Remote images are not fetched and relative assets are not resolved without permission.

**Identified gap/improvement**

- P1: Word/Docs drop or weaken the inline-wrapper container treatment.

**Recommended approach**

- Normalize each fallback to a paragraph-level structure before styling, while retaining the exact alt text and safe link/reason.
- Apply a subtle paragraph border or background, compact padding, and zero nested margins using the same paragraph-model principle as blockquotes.
- Do not use a table wrapper and do not fetch remote assets merely to improve appearance.

**Expected output**

- A compact, clearly bounded fallback reading “Image not loaded,” followed by useful alternative text and a safe source action/reason.

**Platform-specific considerations**

- If a real image is supported in a future permissioned workflow, preserve the real `img` and alt text instead of using the fallback paragraph.

### 5.17 International scripts, emoji, symbols, and bidirectional text

**Current behavior**

- Latin, Devanagari, Japanese, Arabic, Spanish, French, Portuguese, emoji, names with diacritics, and mathematical symbols remain present.
- Word proofing marks many non-dictionary words; content remains intact.
- Mixed-direction identifiers are contained, though visual ordering depends on the destination's Unicode bidirectional algorithm and font coverage.

**Word behavior/guidelines**

- Word uses document fonts and paragraph direction controls. Font fallback and proofing language can affect appearance without changing the text.

**Google Docs behavior/guidelines**

- Docs similarly applies font fallback and paragraph direction. Character order follows Unicode bidi behavior unless explicit direction is applied.

**What we currently do**

- Source Unicode text is preserved.
- The sanitizer removes most attributes, including any future `dir` attribute, unless explicitly allowlisted.

**Identified gap/improvement**

- No text-loss defect is visible.
- P2: isolated mixed-direction tokens may benefit from safe direction metadata, but a global RTL or LTR rule would be harmful.

**Recommended approach**

- P0: preserve exact Unicode content and avoid text transformations.
- Build a focused bidi fixture before considering `dir="auto"`, `<bdi>`, or Unicode-isolation styling. Any allowed `dir` value must be strictly limited to `auto`, `ltr`, or `rtl`.

**Expected output**

- Complete readable multilingual content with mixed-direction identifiers contained inside the page.

**Platform-specific considerations**

- Proofing language and missing glyph behavior belong to the destination/editor configuration.

### 5.18 Long prose URLs, unbroken tokens, and wrapping torture tests

**Current behavior**

- Long URLs, long inline code, unbroken tokens, and long blockquote links remain within page bounds in both editors.
- Breaks can occur at aggressive positions, but there is no page-level overflow.

**Word behavior/guidelines**

- Word normally wraps at spaces/hyphens and may apply its own URL breaking. Nonbreaking characters can change behavior but should not be injected into source content.

**Google Docs behavior/guidelines**

- Docs applies its paragraph and link wrapping within page width; exact break points are destination-controlled.

**What we currently do**

- Inline code and code use safe wrapping; links remain underlined; content is not truncated.

**Identified gap/improvement**

- No general change is needed. Character-by-character wrapping in very narrow table columns is a table-width issue, not a global overflow issue.

**Recommended approach**

- P0: preserve current containment.
- Do not insert zero-width spaces into source text because that would change copied content and identifiers.

**Expected output**

- Complete tokens and URLs remain visible and editable without widening the page.

**Platform-specific considerations**

- Exact wrap positions may differ with fonts, zoom, page size, and editor version.

### 5.19 Consecutive mixed elements and adjacency

**Current behavior**

- Consecutive bold, italic, deletion, inline code, one-line quote, unordered list, ordered list, table, code block, and mixed inline sentence remain in source order.
- The paragraph immediately after “Second adjacent item” appears inside that list item in Word, Docs, and Notion.

**Word behavior/guidelines**

- Word treats paragraphs and list items as distinct blocks and imports the semantic structure it receives.

**Google Docs behavior/guidelines**

- Docs likewise imports paragraphs/lists and applies its own adjacent-block spacing.

**What we currently do**

- `react-markdown` with GFM follows CommonMark parsing.
- The fixture intentionally has no blank line between the second list item and the following sentence, so CommonMark treats that sentence as lazy continuation text inside the same list item.

**Identified gap/improvement**

- P3: this is expected source/parser behavior, not a rich-copy defect.
- The fixture label can mislead reviewers into expecting a separate paragraph.

**Recommended approach**

- Do not alter the serializer or parser.
- If the fixture is intended to test a paragraph outside the list, add a blank source line in a separately approved fixture change. Keep the current boundary case if lazy continuation is intentional.

**Expected output**

- Output matches parsed Markdown semantics exactly; no destination-specific restructuring.

**Platform-specific considerations**

- All three destinations agreeing is evidence that the structure was already present before paste.

### 5.20 Parser boundary cases, literal math, definition-like text, and raw HTML

**Current behavior**

- Malformed emphasis, escaped syntax, repeated punctuation, entity-like text, literal math notation, and definition-like lines remain readable.
- Raw HTML comments and unsafe iframe markup disappear.
- Neither editor crashes or loses surrounding sections.

**Word behavior/guidelines**

- Word may apply proofing or AutoFormat to literal punctuation but the serializer should not reinterpret unsupported Markdown.

**Google Docs behavior/guidelines**

- Docs may autoformat some typed content, but pasted rich content should remain the safe literal fallback produced by the parser.

**What we currently do**

- Raw HTML execution is disabled.
- Unsupported constructs remain literal or ordinary paragraphs/lists.
- Unsafe elements are removed during HTML serialization.

**Identified gap/improvement**

- No gap is visible.

**Recommended approach**

- P0: preserve safe degradation and sanitization.
- Do not add math, definition-list, admonition, or raw-HTML plugins as part of visual formatting work.

**Expected output**

- Readable literal content with no scripts, embeds, or disappearing surrounding text.

**Platform-specific considerations**

- Destination auto-correction and proofing are user settings, not serializer responsibilities.

### 5.21 Page flow and document consistency

**Current behavior**

- Both editors paginate the document and split long prose, lists, code blocks, and tables according to their own layout engines.
- Some headings and table headers become orphaned; very large code/table blocks necessarily continue across pages.
- Overall margins and page count differ between platforms but content remains complete.

**Word behavior/guidelines**

- Word provides keep-with-next, keep-lines-together, widow/orphan control, repeating table headers, and per-row page-break options.

**Google Docs behavior/guidelines**

- Docs provides equivalent paragraph pagination controls in page mode plus pinned table headers and row overflow control.

**What we currently do**

- The export does not insert manual page breaks or general keep-together rules.

**Identified gap/improvement**

- P1: heading and table-header orphaning should be tested.
- P3: exact pagination and page count cannot be normalized across editors.

**Recommended approach**

- Implement pagination improvements only as small independent experiments:
  1. heading keep-with-next;
  2. table header with first row;
  3. header repetition;
  4. row splitting policy for specific table profiles.
- Reject any experiment that creates large blank areas, moves oversized blocks unpredictably, or changes semantic structure.

**Expected output**

- Related headings and initial content remain together where practical; long content still flows naturally; no manual pagination artifacts are embedded.

**Platform-specific considerations**

- Docs pageless mode ignores several page controls.
- Word Online and desktop Word may honor different subsets of imported hints.

## 6. Recommended implementation sequence

Each phase must start from the current complete fixture and end with Word, Google Docs, and Notion regression evidence.

### Phase A — protect the baseline

1. Add/confirm serializer assertions for semantic `h1`–`h6`, nested lists, task state, nested blockquotes, real table sections, safe links, image fallback text, and parser-boundary removal.
2. Retain all code-block invariants: one presentation cell, one code run, literal newlines, no `<br>`, and language metadata.
3. Record the current screenshot artifacts and accepted limitations so they are not misdiagnosed later.

### Phase B — small high-confidence improvements

1. `[x]` Explicitly reset heading italic/underline while preserving heading semantics.
2. `[-]` Add conservative heading pagination hints; automated structure is verified, while Word/Google Docs destination behavior still needs a complete-fixture paste.
3. `[x]` Remove duplicate list bullets from task items only.
4. `[x]` Promote standalone media fallbacks to paragraph-level portable styling.
5. `[x]` Preserve nested quote semantics while making the inner rule visually distinct.

### Phase C — tables, one concern at a time

1. Protect compact tables with dedicated regression assertions.
2. `[-]` Add semantic header-group/pagination hints; header repetition and first-row behavior still need Word/Docs destination validation.
3. Add an independently detected dense profile for the wide matrix.
4. Test proportional hints only for the long-text/link table.
5. Stop if native portrait layout remains unreadable; document the limit and plan a spreadsheet/landscape export instead of flattening the table.

### Phase D — optional experiments

1. Nested ordered marker variation in Google Docs.
2. Safe bidi isolation based on a dedicated fixture.
3. Widow/orphan controls for long-form prose.

## 7. Validation requirements for every implementation change

### 7.1 Automated structure checks

- Exact source order and text completeness.
- Heading levels remain semantic.
- Ordinary paragraphs/lists remain unchanged by specialized normalization.
- Nested list and blockquote structure remains intact.
- Task checked/unchecked states remain readable.
- Tables retain `thead`, `tbody`, `th`, and `td`.
- GFM alignment remains attached to the correct cells.
- Links retain only safe targets.
- Unsafe elements remain absent.
- Code retains exact indentation, newlines, intentional blank lines, and language metadata.
- Media fallback retains label, alt text, and safe action/reason.

### 7.2 Manual destination checks

For every changed element, paste the complete fixture—not an isolated snippet—into:

1. Microsoft Word / Word Online using normal paste or Keep Source Formatting.
2. Google Docs using normal paste in page mode.
3. Notion using normal paste as a semantic regression check.
4. A plain-text editor to confirm the separate text representation remains readable.

Capture both a focused screenshot of the changed element and enough surrounding content to detect spacing regressions.

### 7.3 Acceptance questions

- Is the element still editable and semantic?
- Is all text present exactly once and in order?
- Did spacing improve without introducing empty paragraphs?
- Did any background or border fragment into character-level highlighting?
- Did indentation remain reasonable at nested levels?
- Did long content wrap without page overflow or data loss?
- Did pagination improve without large unexplained blank areas?
- Did ordinary elements outside the target remain visually unchanged?
- Did Notion preserve its already-working native structure?

## 8. Explicit non-goals

- Pixel-identical rendering between Word and Google Docs.
- A fixed page count or identical line wrapping.
- Hiding Word proofing marks through exported formatting.
- Making a 14-column data matrix fully readable on every portrait page without user resizing or another export format.
- Converting unsupported Markdown extensions during formatting work.
- Adding editor-specific editable controls to the Plainmark preview.
- Replacing semantic content with screenshots or images.
- Fetching remote/local image bytes without explicit permission.

## 9. Decision record

The current export is structurally strong: document hierarchy, links, emphasis, lists, code, compact tables, safety degradation, and content completeness already survive. Improvements should therefore be incremental and evidence-driven.

The first implementation candidates are lower-heading style resets, pagination hints, task-marker cleanup, paragraph-level media fallbacks, and targeted table profiles. Code-block serialization, ordinary prose, general link styling, compact tables, sanitization, and parser behavior are protected baselines. Wide-table portrait readability remains a bounded platform limitation unless a targeted experiment produces improvement in both Word and Google Docs without semantic loss.
