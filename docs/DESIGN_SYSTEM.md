# Plainmark Design System

**Status:** Approved foundation  
**Visual direction:** Direction C  
**Companion specification:** [UI Specification](./UI_SPECIFICATION.md)

## 1. Character

Plainmark combines the compact precision of an admin tool with the calm readability of a technical document viewer.

The system is:

- Neutral rather than colorful.
- Bordered rather than heavily shadowed.
- Compact in controls and spacious in prose.
- Technical without feeling like a code editor.
- Confident through dark graphite and restrained teal.

## 2. Design tokens

The values below are the implementation baseline. Minor contrast adjustments are allowed when accessibility testing requires them.

### 2.1 Color

```css
:root {
  --color-canvas: #e9eae8;
  --color-workspace: #f7f7f5;
  --color-surface: #ffffff;
  --color-surface-subtle: #f4f5f3;
  --color-surface-raised: #fafafa;

  --color-header: #171d25;
  --color-header-hover: #242c37;
  --color-ink: #171b22;
  --color-ink-secondary: #4f5865;
  --color-ink-muted: #7a838e;
  --color-ink-on-dark: #f8fafc;

  --color-border: #dde0e2;
  --color-border-strong: #c9ced2;

  --color-accent: #159b78;
  --color-accent-soft: #e8f6f1;
  --color-focus: #20a982;

  --color-warning: #b7791f;
  --color-warning-soft: #fff3d6;
  --color-danger: #c9484e;
  --color-danger-soft: #fdeced;
  --color-info: #3978a8;
  --color-info-soft: #eaf3f9;
}
```

Usage rules:

- Graphite is reserved for the global header and primary actions.
- Teal communicates local/ready/success/focus states.
- Red communicates errors and destructive emphasis only; **Start over** is outlined or muted by default.
- Warning amber is suitable for non-blocking limitations, such as a plain-text clipboard fallback.
- Do not introduce a bright brand blue as a second primary color.

### 2.2 Typography

Recommended fonts:

- Interface and document: Inter Variable.
- Code: JetBrains Mono Variable.
- Fallbacks must remain strong system fonts.

```css
--font-sans: "Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif;
--font-mono: "JetBrains Mono Variable", "SFMono-Regular", Consolas, monospace;
```

Interface scale:

| Token | Size / line height | Weight | Use |
|---|---|---:|---|
| `ui-xs` | `12px / 16px` | 400-500 | Metadata and status |
| `ui-sm` | `13px / 20px` | 400-500 | Controls and sidebar values |
| `ui-md` | `14px / 20px` | 500-600 | Buttons and toolbar filename |
| `ui-title` | `16px / 24px` | 600 | Panel titles |

Document scale:

| Element | Desktop | Mobile | Weight |
|---|---|---|---:|
| Body | `16px / 28px` | `15px / 25px` | 400 |
| H1 | `36px / 44px` | `30px / 38px` | 650-700 |
| H2 | `25px / 32px` | `23px / 30px` | 650 |
| H3 | `20px / 28px` | `19px / 27px` | 650 |
| H4 | `17px / 24px` | `17px / 24px` | 650 |
| Code | `13px / 21px` | `12px / 20px` | 400 |

Use tabular numerals for file size, counts, and table values where helpful. Avoid overly tight letter spacing in body content.

### 2.3 Spacing

Use a 4px base grid.

| Token | Value |
|---|---:|
| `space-1` | `4px` |
| `space-2` | `8px` |
| `space-3` | `12px` |
| `space-4` | `16px` |
| `space-5` | `20px` |
| `space-6` | `24px` |
| `space-8` | `32px` |
| `space-10` | `40px` |
| `space-12` | `48px` |
| `space-16` | `64px` |

Controls use the smaller half of the scale. Document section rhythm uses `24px` through `48px`.

### 2.4 Radius

```css
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 10px;
--radius-shell: 12px;
--radius-pill: 999px;
```

- Controls: `6px` to `8px`.
- Upload and content panels: `8px` to `10px`.
- Do not use highly rounded card styling throughout the interface.

### 2.5 Borders and shadows

Primary separation comes from `1px` borders.

```css
--shadow-xs: 0 1px 2px rgb(17 24 39 / 0.04);
--shadow-sm: 0 3px 10px rgb(17 24 39 / 0.06);
```

- Default panels use no shadow or `shadow-xs`.
- Floating feedback/sheets may use `shadow-sm`.
- Avoid layered shadows, glowing focus, and glass effects.

### 2.6 Control sizing

| Control | Height |
|---|---:|
| Compact icon | `32px` visual, `40px` minimum hit target |
| Standard button/input | `40px` |
| Prominent mobile action | `44px` |
| Header | `52px` desktop / `48px` mobile |

## 3. Core patterns

### 3.1 Primary button

- Graphite background and white label.
- Used for **Choose file** and **Copy document**.
- One primary action per region.
- Hover uses a slightly lighter graphite; active moves darker.
- Focus uses a `2px` teal ring with offset.

### 3.2 Secondary button

- White or transparent background.
- Neutral border.
- Used for **Replace** and file-detail triggers.

### 3.3 Start-over button

- Full width within file details.
- Neutral background and border.
- May use a reset/rotate icon.
- Red text appears only on hover/focus if this remains accessible and does not imply data loss beyond clearing the current view.

### 3.4 Status indicator

- Small teal dot plus text.
- Never use a dot alone when status meaning matters.
- Status is descriptive: **Processed locally** or **Local file**.

### 3.5 Upload panel

- Large dashed or low-contrast solid boundary.
- File icon, concise heading, one-sentence helper, primary button, privacy assurance.
- Entire panel may activate the file picker if keyboard and screen-reader semantics remain correct.
- Drag-active changes border, background, and copy without resizing.

### 3.6 File metadata

- Label uses muted `ui-xs`.
- Value uses `ui-sm`, darker color, and wraps or truncates deliberately.
- Filename should be available in full through wrapping or a tooltip; never permanently hide important identity.

### 3.7 Toasts and alerts

- Toasts confirm transient clipboard results.
- Inline alerts explain persistent file/read errors.
- Color is supported by icon and text.

## 4. Markdown presentation

The rendered document must feel native to the UI while remaining portable when copied.

### 4.1 Headings

- H1 begins the document and has the strongest weight.
- H2 uses a subtle top rhythm, not a decorative background.
- H3-H6 remain visibly hierarchical without becoming tiny.
- Heading anchors, if included, appear only on hover/focus and are not required for v1.

### 4.2 Paragraphs and links

- Body measure targets 65-85 characters per line.
- Paragraph separation: approximately `16px` to `20px`.
- Links use a dark teal/blue-teal, underline on hover, and visible focus.
- Long URLs wrap safely.

### 4.3 Lists

- Preserve ordered/unordered semantics and marker differentiation.
- Nested levels add indentation without squeezing mobile text excessively.
- Task-list checkboxes are read-only and align with the first line of content.

### 4.4 Inline code

- Mono font, `0.9em` scale.
- Subtle neutral fill and border.
- Avoid vivid syntax colors in inline code.

### 4.5 Code blocks

- Very light neutral background with border.
- `12px` to `16px` inner padding.
- Horizontal scrolling at the block level.
- Preserve whitespace and tabs.
- Syntax colors are restrained: muted blue, green, purple, amber, and red.

### 4.6 Blockquotes and callouts

- Standard blockquote: left border with muted text.
- Do not automatically turn every blockquote into a colored alert.
- Optional recognized callouts may use accent soft backgrounds later.

### 4.7 Tables

- Entire table wrapped in a horizontally scrollable region.
- Neutral outer border and row separators.
- Header has a subtle gray fill and medium weight.
- Minimum cell padding: `10px 12px`.
- Preserve GFM alignment.
- Avoid zebra striping unless dense-table testing demonstrates a need.

### 4.8 Horizontal rules

- `1px` neutral border.
- Generous vertical rhythm.

## 5. Icons

Use Lucide React exclusively for interface icons.

- Default size: `16px`.
- Large upload icon: `36px` to `44px`.
- Stroke: approximately `1.75`.
- Icons inherit current color.
- Decorative icons are hidden from assistive technology; functional icon buttons require accessible names.

## 6. Patterns and texture

Direction C does not require decorative textures. If the faint diagonal admin-tool pattern is used, restrict it to secondary header strips or the file-details background at extremely low contrast.

Example:

```css
background-image: repeating-linear-gradient(
  -45deg,
  transparent 0,
  transparent 6px,
  rgb(23 29 37 / 0.018) 6px,
  rgb(23 29 37 / 0.018) 7px
);
```

Never place a visible pattern behind document prose.

## 7. Responsive rules

- At `1024px+`, show the fixed file-details sidebar.
- Below `1024px`, hide the persistent sidebar and expose file details on demand.
- At `768px` and below, reduce document padding and simplify toolbar labels where necessary.
- Never reduce tap targets below `44px` on touch layouts.
- Contain wide Markdown elements rather than scaling their content illegibly.

## 8. Accessibility tokens and states

- Body text contrast targets at least `4.5:1`.
- Large text and essential controls meet WCAG AA.
- Focus ring: `2px` `--color-focus`, `2px` offset.
- Disabled controls remain legible and are not represented only by opacity below approximately 50%.
- Error, success, and warning states always include icon/text, not color alone.

Every interactive component defines:

- Rest.
- Hover.
- Focus-visible.
- Pressed/active.
- Disabled.
- Loading where relevant.
- Success/error where relevant.

## 9. Implementation mapping

Recommended foundation:

- Tailwind CSS for tokens, layout, state variants, and responsive rules.
- Authored CSS for repeated component presentation, complex states, Markdown descendants, and overlays.
- Small project-owned accessible components built on semantic HTML and native `<dialog>`.
- Lucide React for icons.
- A dedicated `markdown.css` layer for the Markdown article; Tailwind Typography is optional and not required.
- Inter Variable and JetBrains Mono Variable through Fontsource or bundled local assets.

The onscreen design system does not replace the clipboard export stylesheet. Copied HTML needs self-contained semantic styles suitable for Word, Google Docs, and rich-text editors.

## 10. Design review checklist

- Graphite header is consistent in empty and loaded states.
- Neutral surfaces do not collapse into indistinguishable white regions.
- Teal is used for state and focus, not broad decoration.
- No more than one primary button appears in a control group.
- Document typography has been reviewed with the full open test case.
- Code and tables scroll internally on narrow screens.
- File metadata uses real, locally derived values.
- Focus and error states are visible in light and dark header regions.
- UI remains intentionally Plainmark instead of resembling a generic component-library theme.
