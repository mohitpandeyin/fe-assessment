# Plainmark Implementation Progress

**Document role:** Single source of truth for implementation planning and progress

**Last updated:** 2026-08-12

**Overall status:** Phase 2 complete and validated; awaiting Phase 3 approval

**Current phase:** Phase 2 exit gate

**Repository:** `mohitpandeyin/fe-assessment`

**Default branch:** `main`

## Status legend

- `[x]` Complete and validated
- `[-]` In progress
- `[ ]` Pending
- `[!]` Blocked or awaiting a decision
- `[~]` Deferred or optional

### Maintenance rules

- Update the overall status, current phase, task marker, validation matrix, issues, and next steps whenever implementation state changes.
- Mark a task complete only after its stated validation has passed; implementation without validation remains in progress.
- Record deviations from this plan under **Important technical decisions** before depending on them in later phases.
- Keep only one task or tightly related task group in progress at a time unless work is deliberately parallelized.
- Do not use this document to redefine product requirements; update the appropriate higher-priority source first.

## 1. Project objective

Build **Plainmark**, a polished browser-only React application that lets a user select one local Markdown file, renders required GitHub-Flavored Markdown cleanly and safely, and copies the complete rendered document in rich HTML, readable plain text, and original Markdown where the browser supports it.

The implementation must prioritize:

1. Accurate and resilient Markdown rendering.
2. Complete, readable, and responsive content presentation.
3. Useful editable paste results in Microsoft Word, Google Docs, Notion, and other rich-text destinations.
4. Safe local-only processing with graceful browser capability fallbacks.
5. Maintainable JavaScript, React, Tailwind CSS, authored CSS, and focused custom components.
6. Accessibility, responsiveness, honest limitations, and a publicly deployable result.

Pixel-perfect reproduction of the concept images or third-party editor output is not a v1 requirement. Content completeness, semantic hierarchy, consistent rhythm, safe overflow, and clipboard portability are the governing quality measures.

## 2. Source hierarchy

When sources disagree, implementation follows this order:

1. `requirements/Frontend_Developer_Assignment.pdf` - authoritative assignment.
2. `docs/PRD.md` - testable interpretation of the assignment.
3. `requirements/open_test_case.md` - representative input, not a complete feature mandate.
4. `docs/CONTENT_RENDERING_AND_COPY.md` - element and clipboard portability contract.
5. `docs/UI_SPECIFICATION.md` and `docs/DESIGN_SYSTEM.md` - approved UI and presentation decisions.
6. `docs/FRONTEND_ARCHITECTURE.md` - implementation boundaries and dependency policy.
7. `docs/PROJECT_CONTEXT.md` - durable decision memory.
8. This file - implementation sequencing, status, blockers, and validation evidence.

No implementation task may silently override a higher-priority source. If a requirement changes, update the relevant source document and this file before changing code.

## 3. Current status and implementation baseline

### 3.1 Repository audit

| Area | Validated baseline | Status |
|---|---|---|
| Git | Implementation branch `v1` tracks `origin/v1`; Phase 1 and Phase 2 changes are not yet committed | `[-]` |
| Remote | `https://github.com/mohitpandeyin/fe-assessment.git` | `[x]` |
| Git identity | `mohitpandeyin` / `mohitpandey411@gmail.com` | `[x]` |
| Commit history | Documentation/progress commits exist; Phase 1 and Phase 2 implementation is currently uncommitted | `[-]` |
| Application source | React foundation plus local document lifecycle, picker/drop intake, metadata, replacement, reset, and recovery UI exist | `[x]` Phases 1-2 |
| Package/build setup | npm manifest/lockfile, Vite React config, Tailwind Vite plugin, and HTML entry point exist | `[x]` Phase 1 |
| Tests | Vitest/jsdom/Testing Library cover application intake flows, reducer invariants, validation, reading, metadata, and the composed loader | `[x]` 6 files / 23 tests |
| Deployment | No hosting configuration or deployed URL recorded | `[x]` Confirmed absent |
| Root README | No implementation/setup README exists at repository root | `[x]` Confirmed absent |
| Requirements | Two-page assignment PDF and representative Markdown fixture are present | `[x]` |
| Product documentation | PRD, UI specification, design system, frontend architecture, project context, and content/copy contract are present | `[x]` |
| Visual references | Locked loaded state, first-visit state, and superseded TOC exploration are present | `[x]` |
| `.gitignore` | Covers dependencies, builds, coverage, environment files, logs, temporary files, editor files, and hosting output | `[x]` |

### 3.2 Implementation baseline

- Phase 1 establishes a reproducible React/Vite/Tailwind foundation.
- Phase 2 establishes the complete one-document local intake lifecycle. Markdown presentation intentionally remains a Phase 3 placeholder.
- There was no pre-existing application functionality to preserve or migrate.
- The repository now installs cleanly from `package-lock.json`, lints, tests, builds, and serves locally.
- The visible application includes practical empty and loaded lifecycle surfaces, but final Direction C composition and responsive refinements remain Phase 4 work.
- `tmp/` is ignored and contains only local PDF inspection artifacts; it is not part of the product.
- Existing documentation continues to govern the new foundation and all later implementation.

### 3.3 Assignment constraints validated from the source PDF

- React is mandatory.
- Source must be JavaScript; TypeScript is prohibited.
- Tailwind CSS is mandatory.
- The app runs entirely in the browser; no backend is required.
- Only one Markdown file is active at a time.
- Required Markdown includes headings, paragraphs, ordered/unordered/nested lists, tables, blockquotes, inline code, code blocks, bold, italic, strikethrough, and hyperlinks.
- Malformed or incomplete Markdown must fail gracefully without crashing the app.
- One Copy action must write HTML and plain text, plus original `text/markdown` where supported.
- Copied HTML should retain useful formatting in Word, Google Docs, and rich-text editors.
- Final delivery requires a public repository, HTTPS deployment, and concise explanatory documentation.
- The intended effort is 4-6 hours, with a polished core valued over feature breadth.

### 3.4 Representative fixture coverage

`requirements/open_test_case.md` includes the required Markdown elements plus several non-required cases:

- Multiple heading depths and long prose.
- Ordered, unordered, mixed, nested, and task lists.
- GFM tables with alignment and dense content.
- JavaScript, Lua, Bash, and YAML code fences.
- Long inline code, commands, Unicode, links, and strikethrough.
- A GFM-style note/admonition.
- Math delimiters.
- Definition-list-like syntax.
- HTML comments.
- External and relative-looking links.

Required syntax must receive explicit tests. Optional syntax must degrade to readable content and must not become v1 scope merely because it appears in the sample.

## 4. Reconciliation findings

### 4.1 Resolved conflicts and precedence rules

| Finding | Resolution for implementation |
|---|---|
| Original Direction C exploration shows a table of contents | Superseded. The locked v1 desktop sidebar shows real file details and **Start over**. |
| Concept images show utilities such as theme/help/overflow icons | Do not implement controls without defined behavior. Theme switching, help, and generic overflow menus are deferred. |
| Concept content shows author/status/date metadata | Do not fabricate or extract undocumented metadata. Render source Markdown normally; sidebar metadata is filename, type, size, and derived word count. |
| Concept code blocks show a per-block copy icon | Deferred. The assignment requires one document-level Copy action. |
| Tailwind is mandatory, while docs favor authored CSS for Markdown | Use Tailwind for layout/responsive composition and authored CSS for tokens, repeated component recipes, Markdown descendants, overlays, and complex states. |
| Design system mentions syntax colors, while syntax highlighting is optional | Ship readable unhighlighted code first. Add highlighting only after all core acceptance gates pass. |
| Preview and pasted output cannot be pixel-identical | Preserve semantic structure and portable essential styles. Do not add editor-specific hacks to chase pixel parity. |
| Images appear in the content contract but are not assignment-required | Handle conservatively: responsive fallback UI, useful alt text, no automatic remote fetch, no temporary object URLs in copy, and no script/iframe execution. |
| Raw Markdown HTML could improve compatibility but creates risk | Keep raw HTML disabled in v1. Unsupported HTML degrades safely through parser behavior. |

### 4.2 Missing implementation areas

The remaining implementation areas are:

- Markdown parser integration and semantic renderers.
- Content typography, overflow, responsive rules, and safe link/image behavior.
- Final Direction C composition, mobile file details, and refined loading/drag/error presentation.
- Responsive file-details sidebar/sheet.
- Custom Button, Dialog/Sheet, Toast, and InlineAlert primitives.
- Portable HTML and semantic plain-text serializers.
- Clipboard capability detection, multi-format write, fallback, and feedback.
- Automated tests and manual validation matrix.
- Root README, build/release checks, deployment configuration, and public URL.

### 4.3 Duplication risks to avoid

- Do not create separate Markdown parsing rules for preview and copy unless testing proves a second pipeline is necessary.
- Do not duplicate design tokens across Tailwind classes, CSS files, and JavaScript style maps. Preview tokens live in CSS; clipboard export uses a deliberately small portable style map.
- Do not build both a mobile sheet and a second independent file-details component. Reuse the same content component in desktop and mobile containers.
- Do not maintain separate file-picker and drag/drop validation paths. Both call the same file intake service.
- Do not duplicate transient status in component-local state and the document reducer.
- Do not introduce a state library, component library, or clipboard package without a demonstrated requirement.

## 5. Approved architecture baseline

### 5.1 Technology direction

| Concern | Planned approach | Status |
|---|---|---|
| Framework/build | Vite + React + JavaScript/JSX | Installed and validated |
| Styling | Tailwind CSS through the Vite integration plus authored CSS | Installed and validated |
| Markdown | `react-markdown` + `remark-gfm` | Installed; integration begins in Phase 3 |
| Icons | `lucide-react` | Installed; usage begins with product UI |
| State | React state/reducer; no external state library | Approved |
| Dialog/sheet | Project-owned wrapper around native `<dialog>` | Approved |
| Toast | Small project-owned context queue/live region | Approved |
| Clipboard | Browser Async Clipboard API with multi-representation `ClipboardItem` and plain-text fallback | Required |
| Tests | Vitest + Testing Library for unit/integration; real-browser manual validation | Foundation configured |
| Backend/storage | None | Required constraint |

### 5.2 Proposed source boundaries

```text
src/
├── app/
│   ├── app.jsx
│   └── app.css
├── components/
│   ├── button/
│   ├── dialog/
│   ├── inline-alert/
│   └── toast/
├── features/
│   ├── document/
│   │   ├── document-reducer.js
│   │   ├── document-workspace.jsx
│   │   ├── file-details.jsx
│   │   └── upload-panel.jsx
│   └── markdown/
│       ├── markdown-document.jsx
│       ├── markdown-components.jsx
│       └── markdown.css
├── lib/
│   ├── clipboard/
│   │   ├── export-styles.js
│   │   ├── serialize-html.js
│   │   ├── serialize-plain-text.js
│   │   └── write-document-clipboard.js
│   └── files/
│       ├── file-metadata.js
│       ├── read-markdown-file.js
│       └── validate-markdown-file.js
├── styles/
│   ├── base.css
│   ├── theme.css
│   └── utilities.css
├── test/
│   ├── fixtures/
│   └── setup.js
└── main.jsx
```

Names may be adjusted during implementation when the actual code exposes a clearer boundary. Responsibility boundaries must remain intact.

### 5.3 State model

Use one focused reducer for the active-document lifecycle:

- `empty`: no active document.
- `reading`: initial file is being read.
- `ready`: active source, filename, size, type, word count, and rendered content are available.
- `replacing`: a candidate replacement is being read while the valid current document remains available.
- `error`: no valid initial document and a recoverable intake/read error is shown.

Replacement errors should return to `ready` with the previous document preserved and an error message. Clipboard feedback belongs to the toast system, not the document reducer. Mobile sheet state stays close to its trigger.

## 6. Dependency and prerequisite decisions

### 6.1 Required dependencies

| Category | Packages/capability | Reason |
|---|---|---|
| Runtime | `react`, `react-dom` | Mandatory application foundation |
| Runtime | `react-markdown`, `remark-gfm` | Safe semantic React rendering with GFM tables, strikethrough, task lists, and autolinks |
| Runtime | `lucide-react` | One consistent interface icon family |
| Build/style | `vite`, `@vitejs/plugin-react`, `tailwindcss`, `@tailwindcss/vite` | Approved React build and mandatory Tailwind integration |
| Test | `vitest`, `jsdom`, Testing Library packages | Focused unit and interaction coverage |
| Quality | ESLint React configuration | Catch JavaScript/React errors and maintain consistency |

### 6.2 Deliberately excluded initially

- Next.js: no routing, server rendering, API, or backend requirement justifies it.
- shadcn/ui, Radix, Base UI, or another component kit.
- Redux, Zustand, Jotai, or another state manager.
- CSS-in-JS.
- Clipboard abstraction libraries.
- Syntax highlighting, KaTeX, Mermaid, sanitizers for raw HTML, or TOC libraries until core completion.
- Playwright unless time remains after the required unit/integration and manual validation matrix.

### 6.3 Approval-time defaults and open decisions

These are not blockers to planning. Approval of this plan authorizes the recommended defaults unless changed explicitly.

| Decision | Recommended default | When finalized |
|---|---|---|
| Package manager | `npm`, because no lockfile or repository preference exists | Phase 1 scaffold |
| File extensions | Accept `.md` and `.markdown`; reject others with clear feedback | Phase 2 |
| File size policy | Accept files up to and including 5 MB. Phase 2 intake measured about 5.46 ms at 1 MB and 29.52 ms at 5 MB; complete rendering is rechecked in Phase 6 | Finalized in Phase 2 |
| Browser support | Current stable Chromium, Firefox, and Safari; rich clipboard is capability-based | Phase 6 |
| Remote images | Block automatic fetch; show alt text and safe link | Already documented |
| Fonts | Start with robust system stacks; add bundled/Fontsource Inter and JetBrains Mono only if visual review justifies the cost | Phase 4 |
| Hosting | Select a static HTTPS host after local release gates pass | Phase 7 |
| Syntax highlighting | Deferred unless every P0 gate passes with time remaining | Phase 7 optional gate |

## 7. Phase overview

| Phase | Objective | Depends on | Status |
|---|---|---|---|
| 0. Validation and plan approval | Establish verified baseline, reconcile requirements, and approve execution order | None | `[x]` |
| 1. Project foundation | Create a runnable, testable React/Tailwind application skeleton | Phase 0 approval | `[x]` |
| 2. Document lifecycle | Implement reliable local file intake and state transitions | Phase 1 | `[x]` |
| 3. Markdown rendering | Implement safe semantic GFM rendering and content presentation | Phases 1-2 | `[ ]` |
| 4. Product UI and responsive states | Build the locked Direction C shell and complete interactions | Phases 2-3 | `[ ]` |
| 5. Rich clipboard export | Implement portable multi-format copy and fallback behavior | Phases 3-4 | `[ ]` |
| 6. Integration hardening | Validate accessibility, responsiveness, security, performance, and compatibility | Phases 2-5 | `[ ]` |
| 7. Release and delivery | Complete documentation, production build, deployment, and handoff | Phase 6 | `[ ]` |

### 7.1 Requirements-to-phase traceability

| Requirement group | Primary phase | Final validation phase |
|---|---|---|
| FR-001 through FR-004 - file select, drop, validation, replace/reset | Phase 2 | Phase 6 |
| FR-010 through FR-016 - required GFM, malformed input, links, images/embeds | Phase 3 | Phase 6 |
| FR-020 through FR-022 - polished reading, file context, long-document stability | Phases 3-4 | Phase 6 |
| FR-030 through FR-034 - single multi-format Copy action and feedback | Phase 5 | Phase 6 |
| FR-040 through FR-041 - local processing and untrusted-input safety | Phases 2-5 | Phase 6 |
| NFR-001 reliability | Phases 2-5 | Phase 6 |
| NFR-002 performance | Phases 2-3 | Phase 6 |
| NFR-003 compatibility | Phases 3-5 | Phase 6 |
| NFR-004 accessibility | Phases 3-5 | Phase 6 |
| NFR-005 privacy | Phases 2-5 | Phase 6 |
| NFR-006 maintainability | All implementation phases | Phases 6-7 |
| NFR-007 visual quality | Phases 3-4 | Phase 6 |
| Public repository, documentation, and HTTPS deployment | Phase 7 | Phase 7 |

## 8. Detailed implementation phases

### Phase 0 - Validation and plan approval

**Objective:** Confirm the real baseline and create a dependency-aware plan before code changes.

**Affected areas:** Requirements, all `docs/` files, Git metadata, `.gitignore`, `progress.md`.

**Dependencies/prerequisites:** None.

#### Tasks

- `[x]` P0.1 Inspect repository tree, hidden files, tracked files, branch, remote, history, and worktree state.
- `[x]` P0.2 Verify Git author identity required by the repository owner.
- `[x]` P0.3 Visually inspect both pages of the authoritative assignment PDF.
- `[x]` P0.4 Inspect the complete representative Markdown fixture and classify required versus optional syntax.
- `[x]` P0.5 Review the PRD, UI specification, design system, architecture, context, content/copy contract, and visual references.
- `[x]` P0.6 Identify missing implementation, resolved conflicts, duplication risks, open decisions, and release obligations.
- `[x]` P0.7 Create this progress tracker and implementation plan.
- `[x]` P0.8 Obtain approval before scaffolding or implementing product functionality.

**Implementation approach:** Read-only inspection except for this progress document. Written specifications override exploratory images where they conflict.

**Validation:** Git state verified; assignment visually reviewed; documentation links and requirements reconciled; no source implementation found.

**Expected outcome:** Approved plan with no product-code changes.

**Exit gate:** User approves implementation sequence and recommended defaults.

---

### Phase 1 - Project foundation

**Objective:** Establish the smallest reliable React/JavaScript/Tailwind project that can support incremental implementation and testing.

**Likely affected files/areas:**

- `package.json`, `package-lock.json`
- `index.html`
- `vite.config.js`
- ESLint configuration
- `src/main.jsx`, `src/app/app.jsx`
- `src/styles/theme.css`, `base.css`, `utilities.css`
- `src/test/setup.js`
- `.gitignore` only if scaffold output exposes a missing pattern

**Dependencies/prerequisites:** Phase 0 approval; package manager default accepted or replaced.

#### Tasks

- `[x]` P1.1 Scaffold Vite React using JavaScript only; remove template/demo assets and behavior.
- `[x]` P1.2 Install only approved runtime, build, style, icon, and test dependencies.
- `[x]` P1.3 Configure Tailwind through the Vite integration and establish CSS import order.
- `[x]` P1.4 Create semantic base styles, design tokens, focus defaults, reduced-motion defaults, and root layout primitives.
- `[x]` P1.5 Create the approved responsibility-based directory structure without empty abstraction layers.
- `[x]` P1.6 Configure scripts for `dev`, `build`, `preview`, `test`, `test:run`, and `lint`.
- `[x]` P1.7 Configure Vitest, jsdom, Testing Library matchers, and cleanup.
- `[x]` P1.8 Add a minimal application smoke test and confirm the blank shell mounts.

**Implementation approach:** Start from the standard Vite JavaScript template, then reduce it to a neutral app root. Do not introduce routing, server code, a UI kit, state management, or optional Markdown plugins.

**Validation/testing:**

- `[x]` `npm ci` succeeds from the lockfile with zero reported vulnerabilities.
- `[x]` Vite 8.2.1 development server starts and responds with HTTP 200.
- `[x]` `npm run build` succeeds; output is generated in ignored `dist/`.
- `[x]` `npm run lint` succeeds with ESLint 10 flat config.
- `[x]` `npm run test:run` succeeds: 1 file and 1 smoke test passed.
- `[x]` Repository scan finds no `.ts` or `.tsx` source/configuration files outside dependencies.

**Expected outcome:** A clean, reproducible, runnable foundation with test and style infrastructure but no product behavior yet.

**Exit gate:** Passed on 2026-08-12. Phase 2 requires explicit approval.

---

### Phase 2 - Document lifecycle and file intake

**Objective:** Implement one-file local processing with reliable validation, replacement, reset, derived metadata, and recoverable errors.

**Likely affected files/areas:**

- `src/features/document/document-reducer.js`
- `src/features/document/upload-panel.jsx`
- `src/features/document/file-details.jsx`
- `src/lib/files/validate-markdown-file.js`
- `src/lib/files/read-markdown-file.js`
- `src/lib/files/file-metadata.js`
- Focused tests and file fixtures

**Dependencies/prerequisites:** Phase 1 testable scaffold; file extension default; initial performance fixture.

#### Tasks

- `[x]` P2.1 Define reducer state, events, invariants, and initial/replacement failure behavior.
- `[x]` P2.2 Implement shared validation for picker and drag/drop paths.
- `[x]` P2.3 Accept one `.md` or `.markdown` file and reject missing, multiple, clearly binary, unreadable, or unsupported inputs with actionable messages.
- `[x]` P2.4 Read source text locally with browser APIs and avoid all network/storage persistence.
- `[x]` P2.5 Derive real metadata: filename, Markdown type label, human-readable size, and approximate word count.
- `[x]` P2.6 Preserve the active valid document until a replacement candidate reads successfully.
- `[x]` P2.7 Make picker cancellation a no-op and prevent duplicate actions while reading.
- `[x]` P2.8 Implement Start over so it clears source, derived state, transient document errors, and returns focus to file selection.
- `[x]` P2.9 Benchmark representative files and document a defensible warning/hard-size policy rather than choosing an arbitrary limit.
- `[x]` P2.10 Test reducer transitions and pure file utilities independently.

**Implementation approach:** Picker and drag/drop normalize into one intake function. Keep browser file handles/references only in current in-memory state. Use a reducer because replacement and recovery transitions are related; avoid a global store.

**Validation/testing:**

- `[x]` Valid picker and drag/drop paths use the same loader and succeed.
- `[x]` Picker cancellation changes nothing.
- `[x]` Empty Markdown is accepted and represented as an empty document.
- `[x]` Missing, multiple, invalid-extension, oversized, binary, and unreadable inputs produce actionable errors.
- `[x]` Failed initial intake returns to a usable picker; failed replacement preserves the previous document.
- `[x]` Successful replacement swaps the active source and metadata. Presentation-owned scroll state does not exist until Phases 3-4.
- `[x]` Duplicate intake actions are ignored while reading.
- `[x]` Start over clears app-held document/error state and restores focus to file selection.
- `[x]` Source inspection confirms no fetch, upload, browser storage, analytics, or persistence code was introduced.
- `[x]` `npm run test:run`: 6 files and 23 tests passed.
- `[x]` `npm run lint`, `npm run build`, and `git diff --check` passed.
- `[x]` Real-browser smoke test loaded `requirements/open_test_case.md`, displayed 8.5 KB and 1,204 words, preserved it after an invalid replacement, reset with picker focus, and produced no console warnings/errors.
- `[x]` Five-run intake benchmark: 1 MB averaged 5.46 ms; 5 MB averaged 29.52 ms on the development machine. The v1 hard limit is 5 MB inclusive; full parse/render performance remains a Phase 6 gate.

**Expected outcome:** A fully testable local document lifecycle independent of Markdown presentation.

**Exit gate:** Passed on 2026-08-12. Phase 3 requires explicit approval.

---

### Phase 3 - Markdown rendering and content presentation

**Objective:** Render required GFM semantics safely, resiliently, and readably across supported widths.

**Likely affected files/areas:**

- `src/features/markdown/markdown-document.jsx`
- `src/features/markdown/markdown-components.jsx`
- `src/features/markdown/markdown.css`
- `src/test/fixtures/required-elements.md`
- `src/test/fixtures/malformed-elements.md`
- Existing `requirements/open_test_case.md`

**Dependencies/prerequisites:** Phases 1-2; installed `react-markdown` and `remark-gfm`; content contract.

#### Tasks

- `[ ]` P3.1 Integrate `react-markdown` with `remark-gfm`; keep raw HTML execution disabled.
- `[ ]` P3.2 Preserve semantic `h1`-`h6`, paragraphs, emphasis, deletion, ordered/unordered/nested/task lists, blockquotes, tables, links, inline code, code blocks, and horizontal rules.
- `[ ]` P3.3 Add custom renderers only for behavior: safe links, table overflow wrapper, inline-versus-block code distinction, read-only task inputs, and conservative image fallback.
- `[ ]` P3.4 Implement safe URL handling and reject dangerous schemes.
- `[ ]` P3.5 Block automatic remote-image fetching in v1; expose useful alt text and a safe link when applicable.
- `[ ]` P3.6 Build `markdown.css` with explicit typography, hierarchy, spacing, table borders/alignment, list rhythm, blockquote treatment, and code presentation.
- `[ ]` P3.7 Contain wide tables and code blocks; wrap long URLs/inline tokens without page-level horizontal overflow.
- `[ ]` P3.8 Ensure optional sample syntax degrades readably: admonitions as normal blockquotes/text, math as literal text, definition-list syntax as readable paragraphs, and comments according to parser behavior.
- `[ ]` P3.9 Add a localized rendering failure boundary/recovery path if the integration can throw outside parser recovery.
- `[ ]` P3.10 Create focused fixtures and assertions for every required element, combinations, malformed boundaries, Unicode, long tokens, and table alignment.
- `[ ]` P3.11 Render the complete open test case and record any intentional optional-syntax limitations.

**Implementation approach:** One semantic React rendering pipeline drives the preview. Avoid class strings on every Markdown element; render inside `.markdown-document` and style descendants in authored CSS. Do not enable raw HTML or optional plugins for visual novelty.

**Validation/testing:**

- Semantic DOM assertions for every required element.
- Combined inline formatting and nested list assertions.
- Table alignment, headers, dense/wide tables, and contained overflow.
- Known/unknown/absent code language labels without rendering failure.
- Malformed/unclosed emphasis, links, tables, lists, and code fences remain usable.
- Remote/relative/unsafe image and link sources produce safe readable behavior.
- Complete open test case renders without an uncaught exception.
- Mobile width and 200% zoom show no document-level horizontal overflow.

**Expected outcome:** A safe, complete, and polished document surface independent of the final application chrome.

**Exit gate:** Required-element and resilience suites pass; open test case is manually reviewed.

---

### Phase 4 - Product UI, states, and responsive interaction

**Objective:** Assemble the locked Direction C experience around the working file and Markdown systems.

**Likely affected files/areas:**

- `src/app/app.jsx`, `app.css`
- `src/features/document/document-workspace.jsx`
- `src/features/document/upload-panel.jsx`
- `src/features/document/file-details.jsx`
- `src/features/document/document-toolbar.jsx`
- `src/components/button/`
- `src/components/dialog/`
- `src/components/inline-alert/`
- `src/components/toast/`
- Theme/base/component CSS

**Dependencies/prerequisites:** Working document lifecycle and renderer from Phases 2-3.

#### Tasks

- `[ ]` P4.1 Implement the stable graphite global header and Plainmark branding for empty and loaded states.
- `[ ]` P4.2 Implement the first-visit upload screen with one clear Choose file action, drag target, supported-file hint, local-processing message, benefits, and no inactive document controls.
- `[ ]` P4.3 Implement drag-over and visible loading states without layout jumps or fabricated progress.
- `[ ]` P4.4 Implement loaded desktop layout: file-details sidebar, document toolbar, centered article viewport, Replace, Copy document, and Start over.
- `[ ]` P4.5 Implement compact mobile/tablet layout with no persistent sidebar.
- `[ ]` P4.6 Reuse file-details content inside a native-dialog bottom sheet or simpler disclosure if the sheet adds unjustified risk.
- `[ ]` P4.7 Implement project-owned Button variants and complete interaction states.
- `[ ]` P4.8 Implement InlineAlert for persistent intake/read failures.
- `[ ]` P4.9 Implement a small accessible Toast provider/viewport for clipboard outcomes.
- `[ ]` P4.10 Apply real locally derived metadata and approved UI labels only.
- `[ ]` P4.11 Exclude the superseded TOC, theme switcher, help/overflow utilities, author/status extraction, and per-code copy controls.
- `[ ]` P4.12 Restore focus appropriately after replacement, reset, and dialog close.

**Implementation approach:** Tailwind handles shell layout, breakpoints, flex/grid, and small one-off utilities. Named authored CSS handles reusable component recipes, states, Markdown presentation, dialog/backdrop, and toast motion. Custom components must own behavior, accessibility, repetition, or meaningful visual recipes.

**Validation/testing:**

- Empty, drag-over, loading, ready, initial-error, replacement-error, copy-success, copy-fallback, and copy-failure states are reachable and understandable.
- Keyboard-only flow covers file selection, replacement, file details, Start over, Copy, and dialog close.
- Focus-visible and status announcements work.
- Desktop sidebar and mobile detail surface expose identical information.
- Layout reviewed at representative mobile, tablet, desktop, wide desktop, and 200% zoom.
- Tap targets meet the documented minimum; no page-level horizontal scrolling.
- Visual review uses locked references as direction, not pixel-match tests.

**Expected outcome:** Complete product flow and responsive shell with all core states, ready for real clipboard integration.

**Exit gate:** Core interaction flow works via keyboard and pointer across supported widths.

---

### Phase 5 - Rich clipboard export

**Objective:** Copy the full rendered document once in portable rich HTML, semantic plain text, and original Markdown where supported.

**Likely affected files/areas:**

- `src/lib/clipboard/export-styles.js`
- `src/lib/clipboard/serialize-html.js`
- `src/lib/clipboard/serialize-plain-text.js`
- `src/lib/clipboard/write-document-clipboard.js`
- `src/features/document/document-toolbar.jsx`
- Clipboard unit/integration tests and manual paste fixture

**Dependencies/prerequisites:** Stable semantic article DOM from Phase 3; Copy UI and toast from Phase 4; HTTPS/localhost browser context for real testing.

#### Tasks

- `[ ]` P5.1 Define a small tag/role-based export style map for headings, paragraphs, lists, blockquotes, links, inline code, code blocks, tables, and rules.
- `[ ]` P5.2 Serialize a controlled clone of the semantic article DOM, unwrapping preview-only overflow containers and excluding application chrome.
- `[ ]` P5.3 Strip scripts, event attributes, temporary object URLs, application-only attributes, controls, and unsupported unsafe elements.
- `[ ]` P5.4 Normalize safe links and preserve semantic nesting, heading levels, table sections/cells, and code whitespace.
- `[ ]` P5.5 Build an element-aware plain-text serializer with paragraph breaks, list markers/nesting, quote prefixes, exact code whitespace, readable link targets, and tab/newline table output.
- `[ ]` P5.6 Preserve the exact uploaded source as `text/markdown`; never regenerate it from HTML.
- `[ ]` P5.7 Capability-detect `ClipboardItem`, supported MIME types, secure context, and clipboard APIs.
- `[ ]` P5.8 Write `text/html` and `text/plain` together; add `text/markdown` only when supported without jeopardizing core formats.
- `[ ]` P5.9 Fall back to `navigator.clipboard.writeText()` with semantic plain text when rich writing fails.
- `[ ]` P5.10 Keep the actual clipboard write directly attached to the user click and avoid network/long asynchronous work before it.
- `[ ]` P5.11 Report **Document copied**, **Copied as plain text**, or actionable failure through accessible toast/live feedback.
- `[ ]` P5.12 Add deterministic serializer tests and mocked clipboard capability/failure tests.

**Implementation approach:** Reuse the already-rendered semantic article as the initial source for a sanitized export clone. This avoids a duplicate Markdown parser and keeps preview/copy semantics aligned. If testing demonstrates that DOM wrapper normalization is brittle, replace only the serializer internals with a dedicated AST/rehype serializer; do not add a second parsing pipeline preemptively.

**Validation/testing:**

- Clipboard item contains correct supported MIME representations.
- HTML includes only document content and portable inline styles.
- No Tailwind dependency, CSS variables, script, event handlers, UI controls, or temporary object URLs remain.
- Plain text is readable and tables are tab-delimited.
- Original Markdown bytes/text are unchanged.
- Unsupported Markdown MIME does not prevent HTML/plain copy.
- Permission denial and unavailable API are recoverable.
- Manual full-document paste into Word/Word Online, Google Docs, Notion, and a plain-text editor.
- Destination normalization is recorded as a limitation rather than “fixed” with brittle application-specific markup.

**Expected outcome:** One reliable Copy document action with the richest portable result supported by the browser.

**Exit gate:** Automated serializer/capability tests pass and the manual destination matrix preserves complete readable content.

---

### Phase 6 - Integration hardening and quality gates

**Objective:** Validate the complete application against reliability, accessibility, responsiveness, security, performance, and browser expectations.

**Likely affected files/areas:** All application modules, test fixtures, configuration, and documentation limitations.

**Dependencies/prerequisites:** All P0 product behavior from Phases 2-5.

#### Tasks

- `[ ]` P6.1 Run full unit/integration suite and remove flaky timing/state assumptions.
- `[ ]` P6.2 Run ESLint and production build; resolve warnings and console errors.
- `[ ]` P6.3 Perform keyboard-only workflow and focus restoration audit.
- `[ ]` P6.4 Run automated accessibility checks where practical and manually verify landmarks, headings, labels, live regions, contrast, and overflow focus.
- `[ ]` P6.5 Review mobile, tablet, desktop, wide desktop, 200% zoom, and reduced-motion behavior.
- `[ ]` P6.6 Test current stable Chromium, Firefox, and Safari; record rich-copy capability differences.
- `[ ]` P6.7 Test representative documents up to at least 1 MB and finalize file warning/limit policy from measured responsiveness.
- `[ ]` P6.8 Verify malformed and adversarial Markdown cannot execute raw HTML, unsafe URL schemes, scripts, or event handlers.
- `[ ]` P6.9 Verify no document content is uploaded, persisted, logged, or sent to analytics.
- `[ ]` P6.10 Confirm failed replacement/copy never discards the current document.
- `[ ]` P6.11 Review dependency necessity, bundle output, and optional feature gates.
- `[ ]` P6.12 Record all known browser/editor limitations for the README.

**Implementation approach:** Fix defects at their owning layer rather than patching symptoms in page components. Treat browser clipboard differences and destination paste normalization as expected capability constraints with documented fallbacks.

**Validation/testing:**

- All automated tests, lint, and build pass from a clean install.
- No serious core-flow accessibility findings.
- No uncaught error for representative malformed input.
- No page-level horizontal overflow at supported widths.
- Required operations remain responsive for the documented file size.
- Real browser and paste matrix results are recorded.

**Expected outcome:** Release candidate satisfying assignment requirements and documented non-functional targets.

**Exit gate:** All P0 acceptance criteria pass; remaining issues are explicitly non-blocking and documented.

---

### Phase 7 - Release, documentation, and deployment

**Objective:** Produce the required public, explainable, reproducible submission.

**Likely affected files/areas:**

- Root `README.md`
- Hosting configuration if required by the selected provider
- `package.json` metadata/scripts
- Existing docs and `progress.md`
- Public deployment and repository state

**Dependencies/prerequisites:** Phase 6 release candidate.

#### Tasks

- `[ ]` P7.1 Create a concise root README with product summary, features, setup, scripts, architecture, design decisions, technical decisions, dependency rationale, privacy, accessibility, testing, AI-assistant use, limitations, incomplete items, and future improvements.
- `[ ]` P7.2 Ensure the README clearly distinguishes required core behavior from deferred enhancements.
- `[ ]` P7.3 Select and configure a static HTTPS hosting provider without adding a backend.
- `[ ]` P7.4 Run clean-install, test, lint, and build checks against the final lockfile.
- `[ ]` P7.5 Deploy and smoke-test empty, upload, preview, replace, Start over, rich copy, and fallback flows on the public URL.
- `[ ]` P7.6 Confirm repository contains no secrets, local documents, build output, temporary artifacts, or unnecessary generated files.
- `[ ]` P7.7 Update this file with final completed tasks, validation evidence, known limitations, deployment URL, and remaining optional backlog.
- `[ ]` P7.8 Prepare the concise submission text required by the assignment.

**Implementation approach:** Deployment remains static and HTTPS. Documentation must enable an evaluator to install, run, test, understand, and discuss the implementation without hidden context.

**Validation/testing:**

- Fresh clone/install succeeds using documented commands.
- Public HTTPS URL loads and supports the core workflow.
- Clipboard behavior is retested in the deployed secure context.
- Repository is clean and synchronized before submission.
- README truthfully reflects actual completion and limitations.

**Expected outcome:** Public repository and deployed application ready for assessment.

**Exit gate:** All final deliverables are present and independently reproducible.

## 9. Cross-phase validation matrix

| Area | Automated validation | Manual validation | Current status |
|---|---|---|---|
| Requirements traceability | Task/requirement mapping in plan and tests | Compare final product to assignment PDF | Planning complete; product pending |
| File intake | 6 files / 23 tests across utilities, reducer, and application flows | Picker, replace failure, metadata, reset/focus, and console smoke test | `[x]` Phase 2 |
| Required Markdown | Semantic DOM assertions | Full fixture visual review | `[ ]` |
| Malformed Markdown | Parser/component resilience cases | Open malformed fixtures | `[ ]` |
| Responsive content | Component assertions where useful | Mobile/tablet/desktop/200% zoom | `[ ]` |
| Accessibility | Testing Library and automated checker where practical | Keyboard, focus, contrast, announcements | `[ ]` |
| Clipboard formats | Serializer and capability mocks | Inspect/paste real clipboard | `[ ]` |
| Word/Docs/Notion paste | Structural serializer assertions | Paste complete fixture into each destination | `[ ]` |
| Security/privacy | URL/sanitization and fallback tests | Network/storage inspection | `[ ]` |
| Performance | Timed representative fixture checks where stable | 1 MB+ document responsiveness | `[ ]` |
| Build/release | Lint, tests, production build | Public deployment smoke test | `[~]` Phase 1 gates pass; deployment pending |

## 10. Completed work

- `[x]` Repository initialized and connected to the correct GitHub remote.
- `[x]` Git username and email configured as requested.
- `[x]` `.gitignore` established.
- `[x]` Assignment and representative Markdown fixture added.
- `[x]` Comprehensive PRD created.
- `[x]` Direction C selected and locked.
- `[x]` First-visit and loaded-state references documented.
- `[x]` File-details sidebar and Start over decision recorded; TOC deferred.
- `[x]` React + Tailwind + authored CSS + project-owned component strategy approved.
- `[x]` No external state-management library decision documented.
- `[x]` Rich-copy feasibility validated and content/paste contract documented.
- `[x]` Semantic content priority and non-pixel-perfect fidelity boundary documented.
- `[x]` Repository/codebase audit completed.
- `[x]` Comprehensive implementation plan created in this file.
- `[x]` Phase 1 Vite/React/JavaScript foundation created.
- `[x]` Tailwind 4 Vite integration and shared design tokens configured.
- `[x]` ESLint 10 flat configuration added and passing.
- `[x]` Vitest/jsdom/Testing Library configured with a passing smoke test.
- `[x]` Clean npm install, development server, lint, tests, and production build validated.
- `[x]` One-file lifecycle reducer and shared picker/drop intake pipeline implemented.
- `[x]` Extension, count, 5 MB inclusive size, binary-content, and read-failure validation implemented.
- `[x]` Real filename, type, size, and Unicode-aware approximate word-count metadata implemented.
- `[x]` Safe replacement, cancellation, duplicate-action guard, empty-file handling, Start over, and focus restoration implemented.
- `[x]` Phase 2 automated, production-build, performance, and real-browser validation completed.

## 11. In-progress work

- `[!]` Phase 2 exit gate: awaiting approval to begin Markdown rendering in Phase 3.

## 12. Pending work

- `[ ]` Phase 3 - Markdown semantics and presentation.
- `[ ]` Phase 4 - Direction C application UI and responsive states.
- `[ ]` Phase 5 - portable rich clipboard export.
- `[ ]` Phase 6 - integrated quality hardening.
- `[ ]` Phase 7 - release documentation and deployment.

## 13. Issues, blockers, and risks

### Active blocker

- No technical blocker. Phase 3 is intentionally paused at the approval gate.

### Open decisions to finalize during planned phases

- `[ ]` Exact stable browser version support statement after real testing.
- `[ ]` Static hosting provider and public URL.
- `[ ]` Whether any optional syntax highlighting fits after every P0 gate passes.

### Known technical risks

| Risk | Planned mitigation |
|---|---|
| Browser rejects one or more clipboard MIME types | Capability-based construction; keep HTML/plain core; plain-text fallback; clear toast |
| Clipboard API requires HTTPS/user activation | Test on localhost and final HTTPS deployment; write directly from button gesture |
| Preview CSS does not survive rich paste | Dedicated semantic HTML serializer with controlled inline export styles |
| Destination editor normalizes formatting | Test structure/content, document limitations, avoid brittle editor-specific markup |
| Malformed Markdown or long content harms usability | Maintained GFM parser, focused malformed fixtures, error boundary, measured file policy |
| Wide tables/code cause page overflow | Element-owned scroll wrappers and responsive CSS |
| Raw HTML, links, or embeds introduce security/privacy issues | Raw HTML disabled, URL policy, conservative image/embed behavior, no remote fetch by default |
| Replacement failure discards current work context | Candidate replacement state; commit new document only after successful read |
| Tailwind classes become noisy and unmaintainable | Tailwind for composition; named CSS for repeated/complex/Markdown styles |
| Optional features consume the time budget | P0 exit gates before any optional dependency or enhancement |

## 14. Important technical decisions

1. Vite is the selected React build because no framework-specific server feature is needed.
2. JavaScript/JSX only; no TypeScript files or configuration.
3. Tailwind is used meaningfully for layout and responsive composition; authored CSS handles the semantic document system and reusable component states.
4. `react-markdown` and `remark-gfm` provide the safe GFM baseline; raw HTML remains disabled.
5. React state/reducer is sufficient; no external state manager is approved.
6. Native platform behavior underpins file input, `<dialog>`, and clipboard operations.
7. File picker and drag/drop share one validation/read pipeline.
8. Preview and copy share semantic document output but not styling technology.
9. Clipboard HTML uses a controlled inline style map; plain text uses semantic traversal; Markdown remains the exact original source.
10. The initial clipboard serializer operates on a controlled clone of the semantic article DOM to avoid duplicate parsing.
11. Remote images are not fetched automatically; temporary object URLs and interactive embeds are not copied.
12. Required rendering, file lifecycle, copy, accessibility, and responsive behavior precede syntax highlighting, TOC, theme, editing, export formats, and other enhancements.
13. Written specifications override generated design artifacts whenever they conflict.
14. npm is the selected package manager and direct dependency versions are pinned exactly in `package.json`; `package-lock.json` is the reproducible source for transitive dependencies.
15. Phase 1 uses React 19.2.8, Vite 8.2.1, Tailwind CSS 4.3.3, Vitest 4.1.10, and ESLint 10.8.1 on the documented Node engine range.
16. Phase 2 accepts one `.md` or `.markdown` file up to and including 5 MB. Intake-only benchmarks were fast at that boundary, while full Markdown parse/render responsiveness remains subject to Phase 6 validation.
17. The active document is committed only after validation and reading succeed; failed replacement never discards the previous valid document.

## 15. Next steps

1. Obtain approval to begin Phase 3.
2. Integrate safe semantic GFM rendering with raw HTML disabled.
3. Build and validate the content typography, overflow rules, safe link/image behavior, required-element fixtures, and malformed-input coverage.
4. Stop at the Phase 3 exit gate before final Direction C composition work.
