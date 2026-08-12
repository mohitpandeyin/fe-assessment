# Frontend Architecture and Styling Strategy

**Status:** Approved for implementation  
**Stack:** React + JavaScript + Tailwind CSS + authored CSS + custom components

## 1. Decision

Plainmark will not use shadcn/ui, Radix, Base UI, or another component library by default.

The implementation will use:

- React with JavaScript and JSX.
- Tailwind CSS for layout, responsive composition, and small one-off utilities.
- Authored CSS for design tokens, repeated visual recipes, Markdown typography, and complex state styling.
- Native platform elements and APIs wherever they provide correct behavior.
- Small project-owned components for buttons, dialogs/sheets, toasts, alerts, and tooltips.

The goal is not to avoid Tailwind classes entirely. The goal is to keep JSX readable and make design intent obvious.

## 2. Styling boundary

Use this decision rule:

| Styling need | Preferred location |
|---|---|
| Parent layout, grid/flex, responsive visibility | Tailwind in JSX |
| One-off spacing or alignment | Tailwind in JSX |
| Repeated component appearance | Named class in component CSS |
| Multiple interaction states | Named class in component CSS |
| Design tokens | `theme.css` |
| Generated Markdown descendants | `markdown.css` |
| Native dialog/backdrop styling | `overlays.css` or component CSS |
| Clipboard-export formatting | Dedicated serialization/export stylesheet logic |

### Good JSX

```jsx
<main className="grid min-h-0 flex-1 lg:grid-cols-[14rem_minmax(0,1fr)]">
  <FileDetailsSidebar />
  <DocumentWorkspace />
</main>
```

This communicates composition clearly.

### Avoid

```jsx
<button className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-transparent bg-slate-900 px-4 text-sm font-medium text-white shadow-xs transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
```

Move that repeated recipe into `.button`, `.button--primary`, and state selectors in component CSS.

## 3. CSS organization

```text
src/
├── components/
│   ├── app-shell/
│   │   ├── app-shell.jsx
│   │   └── app-shell.css
│   ├── button/
│   │   ├── button.jsx
│   │   └── button.css
│   ├── dialog/
│   │   ├── dialog.jsx
│   │   └── dialog.css
│   ├── toast/
│   │   ├── toast-provider.jsx
│   │   └── toast.css
│   └── ...
├── styles/
│   ├── app.css
│   ├── theme.css
│   ├── base.css
│   ├── markdown.css
│   └── utilities.css
└── ...
```

Recommended root import order:

```css
@import "tailwindcss";
@import "./theme.css";
@import "./base.css";
@import "./markdown.css";
```

Keep component CSS colocated when the selectors belong only to that component. Keep global semantic systems, especially Markdown, in `styles/`.

## 4. Token strategy

Define the approved design tokens once in CSS. Expose frequently used tokens to Tailwind through `@theme inline`; keep internal-only values in `:root`.

```css
:root {
  --canvas: #e9eae8;
  --surface: #ffffff;
  --header: #171d25;
  --ink: #171b22;
  --muted-ink: #7a838e;
  --border: #dde0e2;
  --accent: #159b78;
  --focus: #20a982;
}

@theme inline {
  --color-canvas: var(--canvas);
  --color-surface: var(--surface);
  --color-header: var(--header);
  --color-ink: var(--ink);
  --color-muted-ink: var(--muted-ink);
  --color-border: var(--border);
  --color-accent: var(--accent);
  --color-focus: var(--focus);
}
```

This enables meaningful utilities such as `bg-canvas` and `text-ink`, avoiding arbitrary-value noise such as `bg-[#e9eae8]` throughout JSX.

## 5. Custom component policy

A custom component must earn its abstraction. Create one when at least one is true:

- It owns behavior or state.
- It repeats in more than one place.
- It enforces accessibility requirements.
- Its visual recipe contains several states.
- Its name makes parent JSX materially easier to understand.

Do not create wrappers such as `Stack`, `Box`, or `Text` merely to hide normal HTML and Tailwind.

### Initial custom UI components

- `Button`
- `IconButton`
- `Dialog` or `Sheet`
- `ToastProvider` / `ToastViewport`
- `InlineAlert`
- `Tooltip` only if icon-only controls cannot be avoided

Application-specific components remain separate:

- `GlobalHeader`
- `UploadPanel`
- `FileDetailsSidebar`
- `FileDetailsSheet`
- `DocumentToolbar`
- `MarkdownDocument`

## 6. Button implementation

Use a semantic native `<button>`. Keep a small variant API:

```jsx
<Button variant="primary" icon={CopyIcon}>Copy document</Button>
<Button variant="secondary">Replace</Button>
<Button variant="quiet">Start over</Button>
```

Recommended variants are `primary`, `secondary`, and `quiet`; add `danger` only when a genuinely destructive action exists. Recommended sizes are `compact` and `default`.

The component owns disabled/loading semantics and icon alignment. CSS owns hover, focus-visible, active, disabled, and loading presentation.

Avoid general class-merging dependencies until the implementation actually needs them. A small array/filter/join helper is sufficient for this project.

## 7. Dialog and mobile sheet

Build the mobile file-details surface on the native `<dialog>` element and open it using `showModal()`.

Why:

- Modern browsers place it in the top layer.
- `showModal()` makes the rest of the document inert.
- Escape-to-close is provided for modal dialogs.
- The platform handles significant focus behavior.

The project-owned wrapper must still provide:

- `aria-labelledby` pointing to a visible title.
- An explicit Close button.
- Backdrop-click policy.
- Focus restoration to the trigger.
- Scroll-locking verification.
- Supported-browser tests.
- Reduced-motion handling.

The API should stay narrow:

```jsx
<Dialog open={isOpen} onClose={closeDetails} title="File details">
  <FileDetails />
</Dialog>
```

Use a bottom-aligned presentation on mobile. Do not create a confirmation dialog for **Start over**; the product does not edit or persist user data.

## 8. Toast system

Implement a small context-backed toast queue only for clipboard results and similar transient feedback.

Requirements:

- One `ToastProvider` near the application root.
- A `useToast()` hook exposing `showToast({ message, tone })`.
- At most three visible toasts.
- Automatic dismissal after approximately 3-5 seconds.
- Pause dismissal on hover/focus.
- Manual dismiss button.
- `role="status"` for success/informational messages.
- `role="alert"` only for failures needing immediate announcement.
- No focus movement when a toast appears.

Tones are `success`, `warning`, `error`, and `info`.

Do not add a general notification framework, promise API, action buttons, progress bars, or swipe gestures unless a real requirement emerges.

## 9. Tooltip policy

Prefer visible labels. Tooltips are reserved for unavoidable icon-only actions.

A tooltip must:

- Appear on keyboard focus and pointer hover.
- Be associated through `aria-describedby`.
- Remain dismissible.
- Never contain essential information unavailable through the control's accessible name.

If implementing this correctly becomes disproportionate, retain visible labels and omit the tooltip abstraction.

## 10. Markdown styling

Do not place Tailwind utility strings on every custom `react-markdown` renderer.

Render semantic elements inside one root:

```jsx
<article className="markdown-document">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {source}
  </ReactMarkdown>
</article>
```

Style descendants in `markdown.css`:

```css
.markdown-document {
  color: var(--ink);
  font-size: 1rem;
  line-height: 1.75;
}

.markdown-document :where(h1, h2, h3) {
  color: var(--ink);
  font-weight: 650;
  text-wrap: balance;
}

.markdown-document .table-scroll {
  overflow-x: auto;
}
```

Use custom React renderers only when behavior or wrapping is needed, for example safe links, scroll wrappers around tables, inline/fenced code distinctions, and read-only task checkboxes.

## 11. State styling

Prefer semantic data attributes over conditional utility-class construction:

```jsx
<section
  className="upload-panel"
  data-dragging={isDragging || undefined}
  data-invalid={hasError || undefined}
>
```

```css
.upload-panel[data-dragging] {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 6%, white);
}
```

Use conditional Tailwind classes only for small layout changes. CSS data-state selectors are clearer for components with several visual states.

## 12. React state and utilities

No external state-management library is needed.

- `App` or a focused reducer owns the active-file lifecycle.
- Dialog state stays close to its trigger.
- Toast state belongs to `ToastProvider`.
- Derived metadata is computed by pure utilities.
- Clipboard serialization is a pure async service, not a UI component.

Avoid a global document context until multiple distant consumers genuinely require it.

## 13. Dependency budget

Expected runtime dependencies:

- `react`
- `react-dom`
- `react-markdown`
- `remark-gfm`
- `lucide-react`

Optional after core completion:

- `highlight.js` / `rehype-highlight`

Styling/build dependencies:

- `tailwindcss`
- `@tailwindcss/vite`

No component-library, CSS-in-JS, class-variance, class-merging, dialog, toast, or tooltip dependency is approved initially.

## 14. Code-quality guardrails

- Prefer semantic HTML before a custom component.
- Cap most JSX `className` values at roughly 6-8 purposeful utilities. This is a readability guideline, not a lint rule.
- Extract repeated visual recipes; do not extract one-off layout merely to satisfy the class guideline.
- Never store a long Tailwind string in JavaScript constants as a substitute for CSS.
- Avoid arbitrary values when a design token exists.
- Keep component files focused; behavior, markup, and component-specific styles may remain colocated.
- Use comments only for non-obvious behavior or browser quirks.
- Test custom overlays and live regions rather than assuming native semantics cover every integration detail.

## 15. Testing priorities for custom UI

Because we own the interactive components, verify:

- Dialog opens from keyboard and pointer.
- Initial focus is sensible.
- Escape and Close work.
- Background cannot be interacted with while modal.
- Focus returns to the trigger.
- Toast is announced without stealing focus.
- Toast timers pause on hover/focus.
- Upload panel works without drag/drop.
- All button states meet contrast and focus requirements.
- Mobile sheet and page do not create competing scroll containers.

## 16. Final recommendation

Use Tailwind as a low-level composition tool, not as the place where every visual rule must live.

- **Tailwind:** grids, flex, responsive breakpoints, visibility, one-off spacing.
- **CSS:** tokens, component skins, state selectors, Markdown typography, overlays, animations.
- **React:** behavior, state, semantics, and composition.

This satisfies the assignment's Tailwind requirement while keeping the implementation readable, distinctive, and easy to explain in an interview.

