# Project Context and Decision Memory

**Last updated:** 2026-08-12  
**Status:** Requirements, UI direction, and content/copy contract approved; implementation not started

This document preserves the key context and decisions needed to keep future work consistent. Read it together with the [PRD](./PRD.md) before planning or changing the product.

## Current workspace state

- The workspace contains requirements and design documentation; no application scaffold or implementation exists yet.
- The workspace is initialized as a Git repository on `main` with `origin` set to `https://github.com/mohitpandeyin/fe-assessment.git`.
- The authoritative assignment is a two-page PDF at `requirements/Frontend_Developer_Assignment.pdf`.
- `requirements/open_test_case.md` is a representative complex Markdown document used to understand likely edge cases.
- The approved loaded-state visual reference is `docs/assets/direction-c-locked.png`; the dedicated first-visit desktop reference is `docs/assets/first-visit-desktop.png`; the earlier TOC-based exploration is retained separately for provenance.
- The working product name is **Plainmark**.
- Deployment configuration and automated tests have not been created.

## Product interpretation

Build a polished, browser-only application that lets a user upload one Markdown file, read its rendered form, and copy the rendered document in formats suitable for both rich-text and plain-text destinations.

The core product is a **Markdown file viewer and clipboard exporter**. It is not a Markdown editor. Editing, accounts, cloud storage, collaboration, a backend, and multi-file workspaces are out of scope for the initial version.

## Confirmed constraints

- React is mandatory.
- JavaScript must be used; TypeScript is prohibited.
- Tailwind CSS is mandatory for styling.
- All file reading, rendering, and copying must happen in the browser.
- Only one Markdown file is active at a time.
- GitHub-Flavored Markdown is the baseline syntax.
- The required syntax includes headings, paragraphs, ordered/unordered/nested lists, tables, blockquotes, inline code, fenced code, bold, italic, strikethrough, and links.
- Malformed or incomplete Markdown must not crash or disable the application.
- A single Copy action must attempt to write `text/html`, `text/plain`, and, where supported, the original source as `text/markdown`.
- The final submission must include a public repository, public deployment, and concise setup/decision/AI-usage/future-improvement documentation.
- Work should respect the assignment's intended 4-6 hour scope and favor a polished core over feature breadth.

## Working product decisions

These decisions clarify ambiguous areas without expanding the assignment:

1. **Upload-first, read-only experience.** The normal flow is upload, preview, copy, replace/remove. No source editor is included in v1.
2. **Local-first privacy.** File contents remain in memory in the current browser tab and are not uploaded or persisted by the application.
3. **One active document.** Uploading or dropping a new valid file replaces the current document after it is successfully read.
4. **Safe rendering.** Uploaded Markdown is untrusted input. Raw scripts and event handlers must never execute. Raw HTML may be ignored or sanitized; supporting arbitrary raw HTML is not a v1 requirement.
5. **Resilient degradation.** Unsupported or malformed syntax should appear as readable text whenever possible. A localized rendering failure should produce a recoverable error state, not a blank or broken application.
6. **Portable rich copy.** Clipboard HTML must use semantic markup and portable styling. It must not depend only on Tailwind class names, because destination applications do not have the application's stylesheet.
7. **Capability-based clipboard fallback.** The Copy button includes every supported MIME representation in one write. If multi-format clipboard writing is unavailable or rejected, it falls back to copying readable plain text and explains the result to the user.
8. **No silent scope elevation from the sample.** Math, GitHub-style admonitions, definition lists, and Mermaid remain optional/deferred and are not mandatory solely because a sample contains them. After every P0 gate passed, declared-language syntax highlighting was intentionally added as a bounded reading enhancement; unknown and unlabelled code remains readable without guessing.
9. **Accessible responsive baseline.** All essential actions must be keyboard accessible, visibly focused, labeled, and usable at mobile through desktop widths.
10. **No network dependency for rendering.** Core rendering should continue to work after the application has loaded, without sending document contents to an external service.
11. **Direction C is locked for v1.** Use the dark graphite header, neutral document workspace, compact controls, and responsive structure defined in `docs/UI_SPECIFICATION.md`.
12. **File details replace the initial TOC.** The desktop sidebar shows filename, type, size, approximate word count, local-processing reassurance, and **Start over**. A generated table of contents remains future scope.
13. **Mobile removes the persistent sidebar.** File details and **Start over** move to a sheet or disclosure while the document uses the full width.
14. **Plainmark is the working product name.** Visible copy should use the approved labels in the UI specification unless the product is intentionally renamed in documentation first.
15. **Styling uses a deliberate hybrid.** Tailwind handles layout, responsive composition, and small utilities; authored CSS handles tokens, repeated component recipes, complex states, Markdown typography, and overlays.
16. **No UI component library by default.** Buttons, dialog/mobile sheet, toast, alerts, and any necessary tooltip are small project-owned components built on semantic/native platform elements. Native `<dialog>` is the approved overlay foundation.
17. **Readable JSX is a requirement.** Avoid long utility strings, arbitrary-value repetition, and wrapper components that only hide styling. Follow `docs/FRONTEND_ARCHITECTURE.md`.
18. **Content fidelity precedes pixel fidelity.** v1 is judged by complete content, semantic hierarchy, readability, consistent rhythm, responsive overflow, and safe portable copy. Exact matching of the concept image or a destination editor is deferred.
19. **Preview and copy share semantics, not CSS.** The browser preview uses `markdown.css`; clipboard HTML uses a small explicit inline-style map. Both preserve the same heading levels, lists, tables, blockquotes, links, code, and content order.
20. **Cross-editor promise is intentionally bounded.** Word, Google Docs, and Notion should receive clean editable common elements, but each may normalize fonts, spacing, table details, code styling, and layout. No pixel-perfect or editor-specific guarantee is made.
21. **Plain text is semantic.** It preserves list markers, quote prefixes, code whitespace, readable links, and tab/newline table structure rather than relying on raw DOM text extraction.
22. **Images and embeds are conservative.** Images remain responsive and retain alt text, but privacy-first v1 does not automatically fetch remote images, copy temporary object URLs, fetch/embed remote bytes for fidelity, execute embeds, or resolve ungranted local assets. Unsupported media degrades to readable alternative content and a safe link where available.
23. **Code remains read-only.** Fenced code shows a fixed declared-language label, restrained highlighting for a curated common-language set, and a per-block copy action. Full-document clipboard serialization removes preview controls while retaining semantic `<pre><code>` structure and normalized Notion language metadata.
24. **Overflow is keyboard-operable.** Focused code/table regions support horizontal Arrow Left/Right movement plus Home/End, in addition to pointer/trackpad scrolling.
25. **Portable code separates visual containment from text semantics.** One presentation cell owns the complete background, border, and padding; one inline `pre-wrap` run inside semantic `<pre><code>` owns the exact code payload and its literal newlines. Per-line block elements and `<br>`-based serialization are prohibited because Google Docs can treat them as spaced paragraph boundaries, while CSS-only breaks do not preserve source newlines reliably in Word or Notion.
26. **Portable blockquotes remain semantic and use paragraph-level visual fallbacks.** The `<blockquote>` nesting remains available to Notion, while direct quote paragraphs, lists, and nested quotes receive matching left borders, indentation, controlled line height, and zero margins for Word and Google Docs. No table wrapper or background fill is used, and normal document blocks are outside this normalization.

## Recommended technical direction, not yet implementation

- Use a lightweight React build such as Vite unless repository or hosting constraints later require another React framework.
- Prefer `react-markdown` with `remark-gfm` because it maps parsed Markdown to React elements, supports component-level styling, and is safe by default when raw HTML execution is not enabled.
- VS Code's preview is a useful reference but should not be copied literally. VS Code uses `markdown-it`, `highlight.js`, generated HTML, CSS, and an isolated webview. This project can achieve the required behavior with a simpler React-native renderer.
- Treat the onscreen preview and clipboard export as two presentations of the same document semantics. They may require different styling: Tailwind/component styles on screen and portable inline styles in clipboard HTML.
- Follow `docs/CONTENT_RENDERING_AND_COPY.md` for the element matrix, fidelity boundary, serializer responsibilities, and cross-editor validation.
- Keep file reading, Markdown parsing, clipboard serialization, and UI state separated so each can be tested independently.
- Implement the approved React + Tailwind + authored CSS strategy in `docs/FRONTEND_ARCHITECTURE.md`; do not add shadcn, Radix, or another UI kit without first documenting a concrete accessibility or delivery need.

These decisions form the approved implementation baseline. Optional dependencies still require a concrete need and should not displace core delivery.

## Representative edge cases found in the sample

The open test case contains:

- Multiple heading depths and long-form prose.
- Nested and mixed lists.
- Table alignment and dense tables.
- JavaScript, Lua, shell, and YAML code fences.
- Long inline code and commands.
- Task-list checkboxes.
- A GitHub-style note/admonition.
- Mathematical notation.
- Definition-list-like syntax.
- HTML comments.
- External and relative-looking links.
- Unicode symbols and strikethrough.

Required constructs must be verified directly. Optional constructs should degrade readably until intentionally supported.

## Primary risks

- Browsers differ in support for custom clipboard MIME types, especially `text/markdown`.
- A visually correct preview can still produce poor Word or Google Docs paste results if copied HTML depends on app CSS.
- Markdown libraries differ at malformed boundaries and in GFM details such as tables and task lists.
- Arbitrary HTML, links, and remote images can create security or privacy issues if enabled without policy.
- Over-investing in editor features, diagrams, math, themes, or animation would dilute the heavily weighted UI/UX and required-rendering work.

## Open decisions for planning

- Exact maximum file size and whether to warn before processing unusually large files.
- Whether v1 accepts only `.md`/`.markdown` names or also allows text files with Markdown contents.
- Whether a later opt-in should load remote image bytes. The conservative v1 copy path does not fetch/embed them merely for fidelity.
- Which optional enhancements fit after all must-have acceptance criteria pass.
- Supported browser matrix and the exact behavior used for older clipboard implementations.

Until these are resolved, use the conservative defaults in the PRD and do not make irreversible assumptions in code.
