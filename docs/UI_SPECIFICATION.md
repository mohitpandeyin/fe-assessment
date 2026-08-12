# UI Specification: Direction C

**Status:** Approved for implementation planning  
**Decision date:** 2026-08-12  
**Product working name:** Plainmark  
**Approved reference:** [Locked Direction C](./assets/direction-c-locked.png)  
**First-visit desktop:** [Empty-state reference](./assets/first-visit-desktop.png)  
**Earlier exploration:** [Original Direction C](./assets/direction-c-exploration.png)

## 1. Decision summary

Direction C is the locked visual and structural direction for v1.

The application will use a dark graphite global header above a neutral document workspace. The loaded desktop layout contains a narrow contextual sidebar and a flexible document area. For v1, the sidebar shows uploaded-file details and a **Start over** action. A generated table of contents is explicitly deferred to future scope.

This document and the locked reference replace exploratory details shown in the original concept. If an image-generation artifact conflicts with the written specification, this document governs. In particular:

- The desktop sidebar is **File details**, not **Outline**.
- The sidebar has no heading links in v1.
- **Start over** replaces the current document-removal affordance.
- The primary document action remains **Copy document**.
- The generated concept is a visual reference, not a pixel-perfect or content-accurate implementation specification.

## 2. Experience principles

1. **Document first.** The Markdown content receives the largest and calmest region.
2. **Tool-like, not promotional.** The interface resembles a focused desktop utility, not a landing page or analytics dashboard.
3. **Local and trustworthy.** Local-only processing is visible without becoming a warning.
4. **Compact chrome, comfortable reading.** Controls are dense; prose is not.
5. **Restrained feedback.** Teal, amber, and red communicate state rather than decorate the application.
6. **Responsive by simplification.** Mobile removes persistent secondary structure instead of shrinking the desktop layout.

## 3. Supported screen states

### 3.1 Empty desktop

The empty state uses the same dark global header as the loaded state and a centered upload panel within the neutral workspace.

Required content:

- Plainmark product mark and name.
- Header status: **Processed locally**.
- Eyebrow: **MARKDOWN VIEWER**.
- Page title: **Open, preview, and copy Markdown**.
- Page description: **Render complex Markdown beautifully—without uploading your file.**
- File icon.
- Heading: **Open Markdown**.
- Supporting copy: **Drag and drop one .md file here, or choose it from your computer.**
- Primary action: **Choose file**.
- File hint: **Supports .md and .markdown files**.
- Three concise benefit items: **Stays on your device**, **Rendered in your browser**, and **Rich-text copy**.
- Footer assurance: **No account required.**

The empty state does not show an inactive sidebar, file toolbar, or Copy button.

The dedicated visual reference is `docs/assets/first-visit-desktop.png`. It is a focused product entry state, not a marketing landing page: the title remains moderate, the upload panel is the focal point, and **Choose file** is the only solid primary action.

### 3.2 Drag-over desktop

The upload panel retains its dimensions to avoid layout movement. It adds:

- A stronger border and subtle teal wash.
- Updated heading: **Drop to preview**.
- A clearly active file icon.

No pulsing or continuous animation is required.

### 3.3 Loading

For typical files, loading may be too fast to warrant a large transition. When visible:

- Keep the application shell stable.
- Disable duplicate file selection.
- Show concise progress text such as **Preparing preview...**.
- Do not render a fake percentage when byte-level progress is unavailable.

### 3.4 Loaded desktop

The loaded desktop workspace has four regions:

1. Global header.
2. File-details sidebar.
3. Document toolbar.
4. Scrollable document viewport.

```text
┌─────────────────────────────────────────────────────────────┐
│ Global header: Plainmark · Local file            utilities │
├───────────────┬─────────────────────────────────────────────┤
│ File details  │ filename toolbar       Replace  Copy doc.  │
│               ├─────────────────────────────────────────────┤
│ Name          │                                             │
│ Type          │          Rendered Markdown document         │
│ Size          │                                             │
│ Words         │                                             │
│               │                                             │
│ Start over    │                                             │
└───────────────┴─────────────────────────────────────────────┘
```

### 3.5 Error states

File-validation or read errors appear in the upload area or as a contained alert near the file controls. They must:

- State what went wrong in plain language.
- Offer a direct retry or file-selection action.
- Avoid changing the global header to red.
- Preserve the current valid document when a replacement fails.

### 3.6 Copy feedback

- Successful rich copy: **Document copied**.
- Plain-text fallback: **Copied as plain text**.
- Failure: explain that the browser blocked clipboard access and invite the user to try again.

Use a compact toast and an accessible live announcement. The Copy button may temporarily show a check icon, but its visible label returns to **Copy document**.

## 4. Desktop layout

### 4.1 Application frame

- Viewport background: warm neutral gray.
- App occupies the viewport, with a centered framed presentation at very wide widths if desired.
- Recommended maximum shell width: `1600px`.
- Recommended minimum desktop height: full viewport.
- Outer radius may appear on large screens; remove it when the shell meets the viewport edges.

### 4.2 Global header

- Height: `52px` desktop, `48px` mobile.
- Background: graphite.
- Content color: off-white.
- Left: product mark, **Plainmark**, and local status.
- Right: only purposeful utilities. Theme switching is not part of v1 unless explicitly added later.
- A teal dot may accompany **Local file** only when a document is loaded.
- Empty state may use **Processed locally** rather than implying a file is already open.

The header must remain visually stable between states.

### 4.3 File-details sidebar

- Desktop width: `224px` to `240px`.
- Background: off-white or very light neutral.
- Right border: `1px` neutral border.
- Padding: `20px`.
- Heading: **File details**.

Display values available from the browser or derived locally:

- **Name:** full filename, wrapping safely.
- **Type:** Markdown.
- **Size:** human-readable bytes.
- **Words:** locally calculated approximate word count.

Do not show fabricated upload dates, author information, or modification history. Native `lastModified` may be shown only if it is deliberately included and clearly labeled.

The bottom of the sidebar contains:

- A brief local-processing reassurance.
- A full-width secondary/destructive-neutral **Start over** button.

**Start over behavior:** clear the current document and return to the empty state. It does not need a confirmation dialog because the app does not edit or persist changes. The action must be visually distinct from the primary Copy action but should not use alarming solid red styling.

### 4.4 Document toolbar

- Height: approximately `64px` desktop.
- White background with bottom border.
- Sticky within the content column if the document has its own scroll container.
- Left: file icon and filename; avoid repeating every sidebar detail.
- Right: **Replace** and **Copy document**.
- **Copy document** is the only solid primary action.
- Avoid an overflow menu in v1 unless a necessary action cannot otherwise fit.

### 4.5 Document viewport

- Background: warm off-white rather than dashboard gray.
- The article column is centered inside the remaining workspace.
- Reading width: `760px` to `900px`, with wider overflow containers for tables and code when needed.
- Desktop article padding: `48px 52px 80px`.
- The article itself should not look like a floating marketing card. Separation comes from the workspace and content width.

## 5. Mobile layout

### 5.1 General behavior

Breakpoint guidance:

- Mobile: below `768px`.
- Desktop sidebar: `1024px` and above.
- Between those values, use the mobile/tablet simplified structure unless space has been verified.

### 5.2 Empty mobile

- Dark header spans the viewport.
- Upload card fills the available width with `16px` page padding.
- Minimum tap target: `44px`.
- Drag/drop language remains, but **Choose file** is the obvious primary route.
- Privacy reassurance sits directly below the card.

### 5.3 Loaded mobile

- No persistent sidebar.
- The first content row shows truncated filename and compact actions.
- **Copy** remains visible; **Replace** may be text or an accessible icon depending on available width.
- File details are exposed through a compact button opening a bottom sheet or disclosure panel.
- **Start over** lives inside that file-details surface, not in the primary toolbar.
- The document fills the viewport width with `16px` to `20px` padding.
- Tables and code scroll horizontally within themselves, never at page level.

### 5.4 Mobile file-details surface

Preferred behavior: a bottom sheet using the same values and order as the desktop sidebar.

- Title: **File details**.
- Name, type, size, and words.
- Local-processing reassurance.
- Full-width **Start over** button.
- Escape, close button, and focus return are required.

A simpler in-flow disclosure panel is acceptable if a sheet introduces excessive implementation overhead.

## 6. Component inventory

### 6.1 Application components

- `AppShell`
- `GlobalHeader`
- `LocalStatus`
- `UploadPanel`
- `FileDetailsSidebar`
- `FileDetailsSheet` or `FileDetailsDisclosure`
- `DocumentToolbar`
- `MarkdownDocument`
- `ClipboardFeedback`
- `InlineAlert`

These names describe responsibilities, not mandatory filenames.

### 6.2 UI primitives

Project-owned primitives:

- Button and icon button based on native `<button>`.
- Dialog/mobile sheet based on native `<dialog>`.
- Toast viewport and live-region feedback.
- Inline alert.
- Tooltip only when an icon-only action cannot use a visible label.
- Separator through semantic structure or a simple border; no component is needed solely for a line.

Use Lucide React for interface icons. Avoid mixing icon families.
Implementation details and accessibility requirements are defined in the [frontend architecture](./FRONTEND_ARCHITECTURE.md).

### 6.3 Markdown elements requiring explicit design

- `h1` through `h6`.
- Paragraph and link.
- Strong, emphasis, and deletion.
- Ordered, unordered, nested, and task lists.
- Inline code.
- Fenced code block.
- Blockquote.
- Table wrapper, header, row, and cell.
- Horizontal rule.

The Markdown surface may use Tailwind Typography as a starting point, but every required element must be visually reviewed and intentionally customized.

## 7. Content and labels

Use these labels consistently:

| Purpose | Label |
|---|---|
| Product | Plainmark |
| Empty-state heading | Open Markdown |
| File picker | Choose file |
| Replace active file | Replace |
| Copy whole document | Copy document |
| Clear active document | Start over |
| Sidebar/sheet title | File details |
| Privacy status, empty | Processed locally |
| Privacy status, loaded | Local file |

Do not alternate between **Remove**, **Reset**, **New file**, and **Start over** in v1.

## 8. Accessibility and keyboard behavior

- Global header landmark: `header`.
- Sidebar: complementary region labeled **File details**.
- Main document region: `main` containing one `article`.
- File picker remains a real labeled input, even when visually hidden.
- Upload panel works with keyboard and has no drag-only functionality.
- Focus order follows header, sidebar/file controls, toolbar, then document links.
- **Start over** returns focus to **Choose file**.
- Successful replacement returns focus to the document toolbar or article heading.
- Mobile sheet traps focus, closes with Escape, and restores focus to its trigger.
- Tooltip content never carries information unavailable elsewhere.
- Visible focus uses the teal focus ring defined in the design system.
- Status/toast announcements use a polite live region; blocking errors use an assertive announcement only when needed.

## 9. Motion

Motion is limited to:

- Short hover/press color transitions.
- Sheet enter/exit if the mobile sheet is used.
- Toast enter/exit.

Target duration: `120ms` to `180ms`. Respect `prefers-reduced-motion`. Do not animate document content on load.

## 10. Deferred UI

The following are not part of the locked v1 UI:

- Generated table of contents.
- Heading-position tracking.
- Dark document theme.
- Global command/search palette.
- Dashboard navigation.
- Multiple file tabs.
- Editor/preview split view.
- Per-code-block copy controls unless time remains after the required document Copy behavior is complete.

## 11. UI acceptance checklist

- Empty and loaded states share the same dark global header.
- Desktop loaded state includes a file-details sidebar, not a TOC.
- Sidebar contains real file data and a **Start over** action.
- Mobile has no persistent sidebar.
- **Copy document** is visually primary and copies the complete document.
- There is no page-level horizontal scroll at supported widths.
- Tables and code have contained overflow.
- The document remains readable at 200% zoom.
- Every action has hover, focus, pressed, disabled, and relevant loading/success/error behavior.
- The interface does not contain unrelated dashboard controls or fabricated metadata.
- All visible strings follow Section 7.
