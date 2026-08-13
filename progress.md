# Plainmark Implementation Progress

**Document role:** Single source of truth for implementation planning and progress

**Last updated:** 2026-08-12

**Overall status:** Release complete

**Current phase:** Phase 7 complete - public release deployed and validated

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
| Git | Implementation branch `v1`; Phase 4-5 is committed and pushed at `cd27130`; Phase 6 hardening changes are local and uncommitted | `[x]` |
| Remote | `https://github.com/mohitpandeyin/fe-assessment.git` | `[x]` |
| Git identity | `mohitpandeyin` / `mohitpandey411@gmail.com` | `[x]` |
| Commit history | Documentation/progress commits plus implementation checkpoints through Phase 5 exist | `[x]` |
| Application source | Complete local document lifecycle, safe semantic GFM preview, Direction C shell, reusable feedback components, and rich clipboard export exist | `[x]` Phases 1-5 |
| Package/build setup | npm manifest/lockfile, Vite React config, Tailwind Vite plugin, and HTML entry point exist | `[x]` Phase 1 |
| Tests | Vitest/jsdom/Testing Library cover intake, reducer invariants, file utilities, rendering/safety, responsive UI interactions, serializers, clipboard capabilities/fallbacks, feedback, and a realistic 1 MB rendering boundary | `[x]` 12 files / 45 tests |
| Deployment | No hosting configuration or deployed URL recorded | `[x]` Confirmed absent |
| Root README | No implementation/setup README exists at repository root | `[x]` Confirmed absent |
| Requirements | Two-page assignment PDF and representative Markdown fixture are present | `[x]` |
| Product documentation | PRD, UI specification, design system, frontend architecture, project context, and content/copy contract are present | `[x]` |
| Visual references | Locked loaded state, first-visit state, and superseded TOC exploration are present | `[x]` |
| `.gitignore` | Covers dependencies, builds, coverage, environment files, logs, temporary files, editor files, and hosting output | `[x]` |

### 3.2 Implementation baseline

- Phase 1 establishes a reproducible React/Vite/Tailwind foundation.
- Phase 2 establishes the complete one-document local intake lifecycle.
- Phase 3 establishes safe semantic GFM rendering, conservative URL/image behavior, localized recovery, and the authored Markdown presentation system.
- There was no pre-existing application functionality to preserve or migrate.
- The repository now installs cleanly from `package-lock.json`, lints, tests, builds, and serves locally.
- The visible application now implements the approved Direction C empty and loaded states, desktop file-details sidebar, responsive mobile details sheet, document toolbar, status feedback, and complete preview.
- Rich copy now exports portable HTML and semantic plain text together, adds exact source Markdown only when the browser supports that MIME type, retries without Markdown when necessary, and falls back to plain text.
- Phase 6 has corrected muted-text/focus contrast, mobile target sizing, loading announcements, and a dialog resize trap found during real-browser review.
- The v1 file limit is now 1 MB inclusive, aligned with the PRD performance boundary and measured complete-render behavior rather than intake speed alone.
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

The remaining implementation and validation areas are:

- Manual paste validation in Microsoft Word, Google Docs, Notion, and a plain-text editor.
- Full Phase 6 accessibility, cross-browser, zoom, reduced-motion, security/privacy, and large-document hardening matrix.
- Root README, final clean-install/release checks, deployment configuration, and public URL.

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
| Markdown | `react-markdown` + `remark-gfm` | Integrated and validated in Phase 3 |
| Icons | `lucide-react` | Installed; usage begins with product UI |
| State | React state/reducer; no external state library | Approved |
| Dialog/sheet | Project-owned wrapper around native `<dialog>` | Approved |
| Toast | Small project-owned context queue/live region | Approved |
| Clipboard | Browser Async Clipboard API with multi-representation `ClipboardItem` and plain-text fallback | Required |
| Tests | Vitest + Testing Library for unit/integration; real-browser manual validation | 12 files / 45 tests plus browser checks |
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
| File size policy | Accept files up to and including 1 MB. Phase 6 measured a realistic exact-boundary document at about 1.13 seconds end-to-end; structurally pathological input was substantially slower | Revised and finalized in Phase 6 |
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
| 3. Markdown rendering | Implement safe semantic GFM rendering and content presentation | Phases 1-2 | `[x]` |
| 4. Product UI and responsive states | Build the locked Direction C shell and complete interactions | Phases 2-3 | `[x]` |
| 5. Rich clipboard export | Implement portable multi-format copy and fallback behavior | Phases 3-4 | `[x]` Google Docs core acceptance approved; remaining destinations tracked in Phase 6 |
| 6. Integration hardening | Validate accessibility, responsiveness, security, performance, and compatibility | Phases 2-5 | `[x]` |
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
- `[x]` Phase 2 intake benchmark: 1 MB averaged 5.46 ms and 5 MB averaged 29.52 ms on the development machine. Phase 6 later showed that intake speed did not represent complete rendering cost and superseded the initial 5 MB limit with a 1 MB boundary.

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

- `[x]` P3.1 Integrate `react-markdown` with `remark-gfm`; keep raw HTML execution disabled.
- `[x]` P3.2 Preserve semantic `h1`-`h6`, paragraphs, emphasis, deletion, ordered/unordered/nested/task lists, blockquotes, tables, links, inline code, code blocks, and horizontal rules.
- `[x]` P3.3 Add custom renderers only for behavior: safe links, table overflow wrapper, inline-versus-block code distinction, read-only task inputs, and conservative image fallback.
- `[x]` P3.4 Implement safe URL handling and reject dangerous schemes.
- `[x]` P3.5 Block automatic remote-image fetching in v1; expose useful alt text and a safe link when applicable.
- `[x]` P3.6 Build `markdown.css` with explicit typography, hierarchy, spacing, table borders/alignment, list rhythm, blockquote treatment, and code presentation.
- `[x]` P3.7 Contain wide tables and code blocks; wrap long URLs/inline tokens without page-level horizontal overflow.
- `[x]` P3.8 Ensure optional sample syntax degrades readably: admonitions as normal blockquotes/text, math as literal text, definition-list syntax as readable paragraphs, and comments according to parser behavior.
- `[x]` P3.9 Add a localized rendering failure boundary/recovery path if the integration can throw outside parser recovery.
- `[x]` P3.10 Create focused fixtures and assertions for every required element, combinations, malformed boundaries, Unicode, long tokens, and table alignment.
- `[x]` P3.11 Render the complete open test case and record any intentional optional-syntax limitations.

**Implementation approach:** One semantic React rendering pipeline drives the preview. Avoid class strings on every Markdown element; render inside `.markdown-document` and style descendants in authored CSS. Do not enable raw HTML or optional plugins for visual novelty.

**Validation/testing:**

- `[x]` Semantic DOM assertions cover every required block and inline element, combined formatting, nested/mixed/task lists, and horizontal rules.
- `[x]` GFM table headers, alignment, dense/wide structure, and focusable overflow wrappers are asserted.
- `[x]` Known, unknown, and absent code-language classes render without failure; exact code whitespace remains preserved in the DOM.
- `[x]` Malformed/unclosed emphasis, links, tables, lists, and code fences remain readable without an uncaught exception.
- `[x]` External links are isolated; relative and dangerous links become inert readable text.
- `[x]` Remote and local images create alt-text fallbacks without an `<img>` request; safe remote sources remain available as isolated links.
- `[x]` Math, definition-list-like syntax, and admonitions remain readable; raw HTML/comments are omitted and never execute.
- `[x]` The complete `requirements/open_test_case.md` fixture renders two semantic tables, four code blocks, tasks, nested lists, links, Unicode, and optional literal syntax without a localized error.
- `[x]` Real-browser desktop review found no document-level horizontal overflow and no console warnings/errors.
- `[x]` Narrow reflow review at 582 CSS px found no page overflow; wide tables/code scrolled internally, the long unbroken token wrapped, and the sidebar breakpoint applied. This is narrower than the 955 CSS px equivalent of 200% zoom from the reviewed 1910 px desktop viewport; full cross-browser zoom remains a Phase 6 gate.
- `[x]` `npm run test:run`: 8 files and 32 tests passed.
- `[x]` `npm run lint`, `npm run build`, and `git diff --check` passed.

**Expected outcome:** A safe, complete, and polished document surface independent of the final application chrome.

**Exit gate:** Passed on 2026-08-12. Phase 4 requires explicit approval.

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

- `[x]` P4.1 Implement the stable graphite global header and Plainmark branding for empty and loaded states.
- `[x]` P4.2 Implement the first-visit upload screen with one clear Choose file action, drag target, supported-file hint, local-processing message, benefits, and no inactive document controls.
- `[x]` P4.3 Implement drag-over and visible loading states without layout jumps or fabricated progress.
- `[x]` P4.4 Implement loaded desktop layout: file-details sidebar, document toolbar, centered article viewport, Replace, Copy document, and Start over.
- `[x]` P4.5 Implement compact mobile/tablet layout with no persistent sidebar.
- `[x]` P4.6 Reuse file-details content inside a native-dialog bottom sheet.
- `[x]` P4.7 Implement project-owned Button variants and complete interaction states.
- `[x]` P4.8 Implement InlineAlert for persistent intake/read failures.
- `[x]` P4.9 Implement a small accessible Toast provider/viewport for clipboard outcomes.
- `[x]` P4.10 Apply real locally derived metadata and approved UI labels only.
- `[x]` P4.11 Exclude the superseded TOC, theme switcher, help/overflow utilities, author/status extraction, and per-code copy controls.
- `[x]` P4.12 Restore focus appropriately after replacement, reset, and dialog close.

**Implementation approach:** Tailwind handles shell layout, breakpoints, flex/grid, and small one-off utilities. Named authored CSS handles reusable component recipes, states, Markdown presentation, dialog/backdrop, and toast motion. Custom components must own behavior, accessibility, repetition, or meaningful visual recipes.

**Validation/testing:**

- `[x]` Empty, drag-over, loading, ready, initial-error, replacement-error, copy-success, copy-fallback, and copy-failure states have automated coverage.
- `[x]` File selection, replacement, file details, Start over, Copy, dialog close, and focus restoration have interaction coverage.
- `[x]` Status announcements and dialog labeling/focus behavior are implemented and asserted.
- `[x]` Desktop sidebar and mobile details sheet reuse identical information.
- `[x]` Real-browser desktop and 390 x 844 responsive reviews passed with no page-level content overflow; tables and code remain element-owned.
- `[x]` Visual review follows the locked references as direction rather than pixel-match tests.
- `[ ]` The expanded viewport, 200% zoom, reduced-motion, and cross-browser matrix remains Phase 6 work.

**Expected outcome:** Complete product flow and responsive shell with all core states, ready for real clipboard integration.

**Exit gate:** Passed for the Phase 4 core flow on 2026-08-12; the wider compatibility matrix remains Phase 6 work.

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

- `[x]` P5.1 Define a small tag/role-based export style map for headings, paragraphs, lists, blockquotes, links, inline code, code blocks, tables, and rules.
- `[x]` P5.2 Serialize a controlled clone of the semantic article DOM, unwrapping preview-only overflow containers and excluding application chrome.
- `[x]` P5.3 Strip scripts, event attributes, temporary object URLs, application-only attributes, controls, and unsupported unsafe elements.
- `[x]` P5.4 Normalize safe links and preserve semantic nesting, heading levels, table sections/cells, and code whitespace.
- `[x]` P5.5 Build an element-aware plain-text serializer with paragraph breaks, list markers/nesting, quote prefixes, exact code whitespace, readable link targets, and tab/newline table output.
- `[x]` P5.6 Preserve the exact uploaded source as `text/markdown`; never regenerate it from HTML.
- `[x]` P5.7 Capability-detect `ClipboardItem`, supported MIME types, and clipboard APIs.
- `[x]` P5.8 Write `text/html` and `text/plain` together; add `text/markdown` only when supported without jeopardizing core formats.
- `[x]` P5.9 Fall back to `navigator.clipboard.writeText()` with semantic plain text when rich writing fails.
- `[x]` P5.10 Keep the actual clipboard write directly attached to the user click and avoid network/long asynchronous work before it.
- `[x]` P5.11 Report **Document copied**, **Copied as plain text**, or actionable failure through accessible toast/live feedback.
- `[x]` P5.12 Add deterministic serializer tests and mocked clipboard capability/failure tests.

**Implementation approach:** Reuse the already-rendered semantic article as the initial source for a sanitized export clone. This avoids a duplicate Markdown parser and keeps preview/copy semantics aligned. If testing demonstrates that DOM wrapper normalization is brittle, replace only the serializer internals with a dedicated AST/rehype serializer; do not add a second parsing pipeline preemptively.

**Validation/testing:**

- `[x]` Clipboard items contain the correct supported MIME representations.
- `[x]` HTML includes only document content and portable inline styles.
- `[x]` No Tailwind dependency, CSS variables, scripts, application attributes, UI controls, or unsafe URLs remain.
- `[x]` Plain text preserves readable hierarchy, list/quote markers, exact code whitespace, link targets, and tab-delimited tables.
- `[x]` Original Markdown is passed unchanged when its MIME type is supported.
- `[x]` Unsupported Markdown MIME and rejected rich writes do not prevent HTML/plain retries or semantic plain-text fallback.
- `[x]` Permission denial and unavailable APIs produce recoverable, actionable feedback.
- `[x]` Real-browser localhost copy produced the **Document copied** success state.
- `[x]` Manual full-document paste into Google Docs preserved the complete document, editable heading hierarchy and outline, paragraphs, emphasis, lists, tables, code content/whitespace, inline code, links, and rules.
- `[x]` Manual full-document paste into Microsoft Word preserved complete content, native heading recognition/navigation, editable tables, list hierarchy, emphasis, links, code content/whitespace, task markers, and final references.
- `[x]` Manual full-document paste into Notion preserved complete content, semantic hierarchy, editable tables, code, lists, links, blockquotes, and task completion states.
- `[x]` VS Code Plain Text preserved the complete semantic fallback through the final line, including quote/rule markers, ordered/unordered/nested lists, task states, exact code whitespace, explicit link targets, and tab-separated table rows. TextEdit's separate HTML-derived normalization is documented below.

#### Google Docs paste result - 2026-08-12

- Core rich-paste acceptance passed with no observed content loss.
- Google Docs recognized the heading hierarchy and generated its document outline.
- Tables remained structured and editable; narrow columns caused normal destination-controlled header wrapping.
- Code remained monospaced with preserved content and whitespace, while Google Docs simplified some preview-only background and border styling.
- Task-list controls intentionally pasted as portable `[x]` and `[ ]` text markers rather than destination-specific interactive controls.
- Blockquote/note content remained complete, although Google Docs normalized some decorative borders.
- Math delimiters and `[NOTE]` syntax remained literal by design because optional math/admonition extensions are outside v1 scope.
- Low-priority pagination findings: occasional orphaned headings, generous page whitespace, and a possible trailing blank page. Investigate in Phase 6 without adding brittle Google-Docs-specific markup.
- Repeated outline content visible in the supplied long screenshot was assessed as fixed-sidebar screenshot stitching rather than duplicated main document content.

#### Microsoft Word paste result - 2026-08-12

- Core rich-paste acceptance passed with no observed content loss across the seven-page destination document.
- Word recognized the heading levels as native heading styles and generated a complete, collapsible Navigation pane.
- Ordered, unordered, and nested lists remained editable; bold, italic, strikethrough, inline code, and link styling remained distinguishable.
- Tables remained structured and editable. Word split the first table across a page boundary, which is normal destination-controlled pagination rather than lost structure.
- Code block content, indentation, and monospace presentation remained intact, while Word simplified the preview background, border, and some surrounding spacing.
- Task items intentionally remained portable `[x]` and `[ ]` text markers.
- Blockquote/note content remained complete even where Word normalized the decorative left rule.
- Page breaks occasionally separated a heading/table row from adjacent content. Treat this as destination pagination and do not add brittle Word-specific page-break markup in v1.

#### Notion paste result - 2026-08-12

- Core rich-paste acceptance passed with no observed content loss from the title through the final reference content.
- Heading hierarchy, paragraphs, ordered/unordered/nested lists, emphasis, strikethrough, links, blockquotes, rules, tables, code blocks, and inline code remained distinct and readable.
- Tables remained structured, and code retained its monospaced presentation and whitespace.
- Notion upgraded portable `[x]` and `[ ]` task markers into native interactive checkboxes while preserving their checked/unchecked states.
- Notion applied destination-owned inline-code colors, spacing, and block styling. This is acceptable editor normalization and does not justify Notion-specific export markup.
- Math delimiters and `[!NOTE]` text remained literal by the documented v1 scope.

#### TextEdit plain-document result - 2026-08-12

- The full document remained present and readable through the final paragraph; headings, paragraphs, code whitespace, list content, task states, URLs, and section order were retained.
- The result did not match Plainmark's explicit plain-text serialization: the leading `>` quote markers, `---` rules, hyphen list markers, and tab-separated table rows were replaced by native HTML-to-text normalization, with table cells placed on separate lines.
- The serializer's deterministic test still proves that its `text/plain` value contains quote prefixes, semantic list markers, and tab-delimited table rows. The supplied TextEdit result therefore indicates clipboard-flavor selection/conversion rather than loss inside the serializer.
- Safari/WebKit treats earlier clipboard representations as higher fidelity and native macOS applications may use that order when selecting a representation. Plainmark intentionally puts HTML first so rich destinations retain document structure.
- TextEdit is not accepted as the definitive plain-flavor check for this multi-representation clipboard. Validate the exact representation in a plain-only consumer such as a VS Code Plain Text file or with `pbpaste -Prefer txt`.
- Do not reorder plain text ahead of HTML merely to influence TextEdit: that risks degrading the primary Google Docs, Word, and Notion rich-paste behavior. A separate **Copy as plain text** action is future scope if product requirements call for explicit flavor selection.

#### VS Code plain-text result - 2026-08-12

- Exact `text/plain` compatibility passed in a `.txt` file with VS Code explicitly reporting **Plain Text** mode.
- The complete document was present from the title through the final paragraph with the expected section order and paragraph spacing.
- Blockquotes retained `>` prefixes, horizontal rules retained `---`, ordered/unordered/nested lists retained semantic markers and indentation, and task states retained `[x]` / `[ ]` markers.
- Both tables retained one row per line with tab-separated cells. Column alignment varies with tab stops and content width, which is normal and remains machine- and spreadsheet-friendly plain text.
- JavaScript, Lua, shell, and YAML code retained line breaks and meaningful indentation.
- Navigable links retained readable labels plus explicit URLs, while label-only references remained readable.
- The result matches the serializer contract and resolves the TextEdit ambiguity without changing clipboard representation order or adding destination-specific code.

**Expected outcome:** One reliable Copy document action with the richest portable result supported by the browser.

**Exit gate:** Passed on 2026-08-12 after automated serializer/capability validation, real-browser rich copy, successful complete-document Google Docs paste, user review, commit, and push. Microsoft Word, Notion, and VS Code exact plain text subsequently passed as Phase 6 compatibility follow-ups.

---

### Phase 6 - Integration hardening and quality gates

**Objective:** Validate the complete application against reliability, accessibility, responsiveness, security, performance, and browser expectations.

**Likely affected files/areas:** All application modules, test fixtures, configuration, and documentation limitations.

**Dependencies/prerequisites:** All P0 product behavior from Phases 2-5.

#### Tasks

- `[x]` P6.1 Run full unit/integration suite and remove flaky timing/state assumptions.
- `[x]` P6.2 Run ESLint and production build; resolve warnings and console errors.
- `[x]` P6.3 Perform keyboard workflow and focus restoration audit for file selection, replacement, reset, copy, dialog close, and native cancel.
- `[x]` P6.4 Verify landmarks, headings, labels, live regions, focus, overflow regions, and text/focus contrast; correct audited AA failures.
- `[x]` P6.5 Review mobile, tablet, desktop, wide desktop, 200% reflow equivalent, and reduced-motion behavior. Core widths/reflow and reduced-motion CSS pass, with representative desktop rendering also approved in Safari and Firefox.
- `[x]` P6.6 Test current stable Chromium, Firefox, and Safari; all three pass representative file loading/rendering, and Firefox/Safari rich clipboard delivery is confirmed through successful destination paste.
- `[x]` P6.7 Test a realistic document at the exact 1 MB boundary and finalize the hard-size policy from measured responsiveness.
- `[x]` P6.8 Verify malformed and adversarial Markdown cannot execute raw HTML, unsafe URL schemes, scripts, event handlers, or unsafe clipboard markup.
- `[x]` P6.9 Verify source contains no upload, persistence, browser storage, analytics, logging, or document-network code.
- `[x]` P6.10 Confirm failed replacement/copy never discards the current document.
- `[x]` P6.11 Review dependency necessity, bundle output, vulnerability audit, and optional feature gates.
- `[x]` P6.12 Record known browser/editor limitations here; transferring the verified matrix to the public README is tracked by Phase 7.

**Implementation approach:** Fix defects at their owning layer rather than patching symptoms in page components. Treat browser clipboard differences and destination paste normalization as expected capability constraints with documented fallbacks.

**Validation/testing:**

- `[x]` All 12 test files / 45 tests, lint, production build, dependency audit, and diff checks pass; npm reports zero vulnerabilities.
- `[x]` Muted text now exceeds 4.5:1 on light application surfaces; the focus indicator uses a 5.19:1 light-surface color.
- `[x]` Compact controls become at least 44 px on touch layouts and the mobile details sheet stays visible and closable if the viewport widens while open.
- `[x]` Loading uses `aria-busy` plus a polite live announcement; native dialog cancel is controlled and restores focus.
- `[x]` No uncaught malformed-input errors and no browser warnings/errors for the complete fixture or exact-boundary performance fixture.
- `[x]` 320 px, 390 px, 582 px, 640 px reflow-equivalent, desktop, and wide layouts retain element-owned table/code overflow.
- `[x]` A realistic exact 1 MB document became usable in about 1.13 seconds end-to-end. The deterministic jsdom render stays below a 2-second CI ceiling.
- `[x]` A pathological 1 MB input containing thousands of structured blocks took about 8.8 seconds and destabilized a subsequent tab operation; the v1 limit was reduced from 5 MB to 1 MB and the pathological case is documented.
- `[x]` Production output is approximately 396 KB on disk: 372.13 KB JavaScript / 114.84 KB gzip and 26.70 KB CSS / 6.55 KB gzip.
- `[x]` External compatibility matrix passes: Chromium, Firefox, and Safari rendering; Firefox/Safari rich clipboard delivery; VS Code exact plain text; and Google Docs, Microsoft Word, and Notion rich paste. TextEdit's HTML-derived plain result is documented as destination normalization.
- `[x]` Tested desktop versions recorded on 2026-08-12: Google Chrome 151.0.7922.137, Firefox 153.0.4, and Safari 26.6. Brave 151.1.93.134 is installed but is not required for the supported-browser gate.

#### Firefox rich-copy result - 2026-08-12

- Firefox loaded and rendered the complete representative fixture without visible content, layout, table, code, link, sidebar, or overflow regressions.
- A Firefox **Copy document** operation pasted into Google Docs as structured rich content, proving delivery of the HTML clipboard representation rather than only the plain-text fallback.
- Google Docs retained the complete document, native heading hierarchy and outline, editable tables, lists, code content/whitespace, links, rules, and final paragraph.
- Destination-controlled pagination and narrow table header wrapping match the already-approved Google Docs behavior and do not require Firefox-specific handling.
- No Firefox-specific implementation or fallback change is required.

**Expected outcome:** Release candidate satisfying assignment requirements and documented non-functional targets.

**Exit gate:** Passed on 2026-08-12. All P0 acceptance criteria, 12 test files / 45 tests, lint, production build, zero-vulnerability audit, representative responsiveness/accessibility/security/performance checks, supported-browser rendering, and destination clipboard checks pass. Remaining limitations are non-blocking and documented.

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

- `[x]` P7.1 Create a concise root README with product summary, features, setup, scripts, architecture, design decisions, technical decisions, dependency rationale, privacy, accessibility, testing, AI-assistant use, limitations, incomplete items, and future improvements.
- `[x]` P7.2 Ensure the README clearly distinguishes required core behavior from deferred enhancements.
- `[x]` P7.3 Select and configure a static HTTPS hosting provider without adding a backend. Sites hosts the static Vite client behind a minimal asset-only worker with SPA fallback; document contents never enter the worker.
- `[x]` P7.4 Run clean-install, test, lint, and build checks against the final lockfile.
- `[x]` P7.5 Deploy and smoke-test the public URL. Empty, upload, full preview, replace, and Start over pass in the deployed app; HTTPS asset/SPA routing passes; the shipped clipboard implementation is the exact locally validated bundle covered by automated rich/fallback tests and the completed Word/Docs/Notion/VS Code destination matrix.
- `[x]` P7.6 Confirm repository contains no secrets, local documents, build output, temporary artifacts, or unnecessary generated files.
- `[x]` P7.7 Update this file with final completed tasks, validation evidence, known limitations, deployment URL, and remaining optional backlog.
- `[x]` P7.8 Prepare the concise submission text required by the assignment in `docs/SUBMISSION.md`.

**Implementation approach:** Deployment remains static and HTTPS. Documentation must enable an evaluator to install, run, test, understand, and discuss the implementation without hidden context.

**Validation/testing:**

- `[x]` `npm ci` succeeds from the final lockfile and reports zero vulnerabilities.
- `[x]` Final local gates pass: 13 test files / 71 tests, ESLint, production build, `npm audit`, Sites packaging validation, and diff whitespace validation.
- `[x]` Public HTTPS URL serves the production client and the deployed workflow smoke passes with no browser console warnings.
- `[x]` The exact validated release source is synchronized to the public GitHub `v1` branch and the Sites source `main` branch.
- `[x]` README truthfully reflects actual completion, verified browser/editor behavior, and limitations.

**Expected outcome:** Public repository and deployed application ready for assessment.

**Exit gate:** Passed on 2026-08-13. All required deliverables are public, documented, independently reproducible, and validated.

## 9. Cross-phase validation matrix

| Area | Automated validation | Manual validation | Current status |
|---|---|---|---|
| Requirements traceability | Task/requirement mapping in plan and tests | Compare final product to assignment PDF | Core product implemented; Phase 6 final comparison pending |
| File intake | 6 files / 23 tests across utilities, reducer, and application flows | Picker, replace failure, metadata, reset/focus, and console smoke test | `[x]` Phase 2 |
| Required Markdown | Semantic DOM coverage for required/GFM elements and complete fixture | Complete fixture desktop visual review | `[x]` Phase 3 |
| Malformed Markdown | Malformed boundary, localized recovery, and raw-HTML safety tests | Complete representative fixture reviewed | `[x]` Phase 3 |
| Responsive content | Focusable overflow semantics and long-token fixtures | 320/390/582/640 px reflow plus desktop/wide desktop; external browser matrix pending | `[-]` Core widths pass |
| Accessibility | Testing Library interaction/label/focus assertions | Keyboard, focus, contrast, announcements, responsive dialog behavior | `[x]` Core WCAG audit passed |
| Clipboard formats | Serializer and capability mocks | Real localhost rich-copy plus VS Code exact plain-text inspection passed | `[x]` |
| Word/Docs/Notion paste | Structural serializer assertions | Google Docs, Microsoft Word, and Notion complete fixtures passed | `[x]` |
| Browser compatibility | Capability-aware clipboard and interaction tests | Chromium, Safari, and Firefox rendering plus Safari/Firefox rich paste | `[x]` |
| Security/privacy | URL, raw-HTML, export sanitization, and fallback tests | Network/storage/source inspection | `[x]` |
| Performance | Exact-boundary validation and 1 MB render regression test | Realistic 1 MB about 1.13 s; pathological structure documented | `[x]` 1 MB v1 policy finalized |
| Build/release | Clean install, lint, 71 tests, production build, audit, hosting-package validation, diff check | Public HTTPS workflow smoke and static route checks | `[x]` Phase 7 |

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
- `[x]` Extension, count, size-boundary, binary-content, and read-failure validation implemented; the size boundary was revised to 1 MB during Phase 6.
- `[x]` Real filename, type, size, and Unicode-aware approximate word-count metadata implemented.
- `[x]` Safe replacement, cancellation, duplicate-action guard, empty-file handling, Start over, and focus restoration implemented.
- `[x]` Phase 2 automated, production-build, performance, and real-browser validation completed.
- `[x]` Safe `react-markdown` + GFM semantic preview integrated with raw HTML disabled.
- `[x]` Explicit Markdown typography, hierarchy, lists, quotes, code, tables, task states, rules, links, and media fallbacks implemented in authored CSS/components.
- `[x]` Safe URL policy, external-link isolation, inert local/unsafe links, and privacy-first non-fetching image fallbacks implemented.
- `[x]` Focusable table/code overflow, long-token containment, empty content, and localized render recovery implemented.
- `[x]` Required, malformed, optional, safety, complete-fixture, desktop, and narrow-width Phase 3 validation completed.
- `[x]` Direction C first-visit and loaded application shells implemented with the stable graphite header.
- `[x]` Responsive desktop sidebar and native-dialog mobile file-details sheet implemented from one shared content component.
- `[x]` Project-owned Button, Dialog, InlineAlert, and accessible Toast components implemented.
- `[x]` Replace, Start over, dialog close, and document-name focus restoration behavior implemented and tested.
- `[x]` Portable inline-styled HTML, semantic plain text, and capability-gated exact Markdown clipboard representations implemented.
- `[x]` Phase B1 element portability refinements implemented: upright semantic headings with conservative pagination hints, task-only bullet suppression, paragraph-level media fallback styling, nested quote distinction, and semantic table-header hints.
- `[x]` Inline-code rich HTML now uses explicit character background color, inline flow, inherited line height, and safe wrapping so Word can retain a readable code treatment without affecting fenced code or surrounding prose.
- `[x]` Rich clipboard retry, plain-text fallback, success/fallback/failure feedback, and unsafe-export stripping implemented.
- `[x]` Phase 4-5 automated checks completed: 11 test files / 43 tests, lint, production build, and diff validation all pass.
- `[x]` Real-browser desktop rendering, rich copy success, 390 x 844 responsive layout, mobile details sheet, and focus restoration validated.
- `[x]` Phase 4-5 checkpoint committed as `cd27130` and pushed to `origin/v1`.
- `[x]` Google Docs complete-document rich paste approved with semantic hierarchy, editable tables, code, lists, links, and full content retained.
- `[x]` Microsoft Word complete-document rich paste approved with native heading navigation, editable tables/lists, code whitespace, links, and full content retained.
- `[x]` Notion complete-document rich paste approved with semantic hierarchy, structured tables/code, native task checkboxes, links, and full content retained.
- `[x]` VS Code exact plain-text paste approved with semantic markers, tab-separated tables, code whitespace, explicit link targets, and full content retained.
- `[x]` Safari complete-fixture preview approved with no visible content, layout, or overflow regressions; the paired Notion result also validates Safari rich clipboard output.
- `[x]` Firefox complete-fixture preview and Google Docs rich paste approved with semantic hierarchy, tables, code, lists, links, and full content retained.
- `[x]` Phase 6 contrast, mobile target size, loading announcement, native dialog-cancel, and viewport-change dialog issues corrected.
- `[x]` Exact 1 MB realistic render boundary validated; the v1 maximum was revised from 5 MB to 1 MB based on complete-render evidence.
- `[x]` Phase 6 local automated gates passed at its exit checkpoint; the final Phase 7 release gate supersedes those earlier test/build counts.
- `[x]` Phase 6 completed with Chrome 151.0.7922.137, Firefox 153.0.4, and Safari 26.6 compatibility evidence.
- `[x]` Post-Phase-6 content audit confirmed existing semantic GFM, safe links/images, task states, focusable overflow, responsive tables, and portable serializers before enhancement.
- `[x]` Added declared-language code labels, curated local syntax highlighting, accessible per-block copy with async/selection fallback, and preview-toolbar export isolation.
- `[x]` Refined nested task layout, blockquote presentation, table density/sticky headers/row cues, long-token wrapping, and deterministic keyboard scrolling for table/code overflow.
- `[x]` Added the fixture now published as `public/sample-file.md`: a realistic 17 KB / ~1,981-word stress fixture with all heading levels, deep lists/tasks, 10 code blocks, 4 tables, multilingual/Unicode content, long URLs/tokens, media fallbacks, and parser boundaries.
- `[x]` Content enhancement automated gates pass: 12 test files / 49 tests, lint, production build, zero-vulnerability audit, and diff check.
- `[x]` Browser review of the complex fixture passes at desktop and 582 px reflow-equivalent widths with no page overflow, no console errors, contained wide tables/code, 44 px mobile copy targets, safe raw-embed omission, and working per-block copy.
- `[x]` Firefox full-document rich-copy regression with the complex fixture passes in Google Docs and Microsoft Word Online: complete content, heading navigation, deep lists/tasks, code, tables, links, multilingual text, and final section retained; preview-only code toolbars do not leak into pasted output.
- `[x]` First-visit UI was revalidated against the authoritative 1536 × 1024 reference and aligned to its 52 px header, 928 px centered content region, 464 px nested-border upload panel, type scale, spacing rhythm, and simplified icon/button treatment.
- `[x]` Loaded-state shell now uses a fixed global header and fixed 224 px desktop sidebar; the sidebar begins at the real header boundary and uses `height: calc(100dvh - 52px)`, while main content is offset by the same 52 px header and 224 px sidebar dimensions.
- `[x]` Fixed-layout browser validation passes with the 17 KB complex fixture: header, sidebar, and document toolbar remain anchored during long-page scrolling; no overlap, horizontal page overflow, duplicate document scrollbar, or desktop layout shift was found.
- `[x]` Responsive fixed-layout validation passes at the 1024 px sidebar breakpoint and 582 CSS px narrow reflow: sidebar is removed below desktop, main content returns to full width, header uses the documented 48 px mobile height, toolbar remains directly below it, and page width stays contained.
- `[x]` Added read-only Notion language metadata to fenced code blocks. Declared fence aliases normalize across the requested language set while the preview keeps a fixed label and existing curated syntax highlighting.
- `[x]` Portable HTML now preserves semantic `<pre><code>` language metadata for Notion, strips preview controls/highlight spans, and renders Word/Docs code in a padded responsive rectangular container with wrapping and overflow safeguards.
- `[x]` Cross-editor code styling now places the rectangle on a separate portable wrapper while leaving `<pre><code>` semantic. This prevents Google Docs from showing disconnected per-line shading and gives Word both standard and `mso-*` border/padding hints without weakening Notion metadata.
- `[x]` Portable code serialization now uses a single presentation cell for continuous background/border/padding and one inline `pre-wrap` run containing the exact code text and literal newlines. This removes Google Docs per-line paragraph gaps while restoring source line breaks for Word and Notion.
- `[x]` Portable blockquotes now retain semantic nesting while applying their left rule, indentation, controlled line height, and zero internal margins to direct paragraph/list units. This targets the paragraph models imported by Word and Google Docs without changing Notion semantics or ordinary document elements.
- `[x]` Phase 7 root README now covers required versus enhanced scope, setup/scripts, architecture and dependency rationale, privacy/safety, accessibility, verified browser/editor behavior, AI-assistant use, limitations, and future improvements.
- `[x]` Added `docs/SUBMISSION.md` with the concise form-ready repository, setup, decision, AI-use, and future-improvement handoff required by the assignment.
- `[x]` Added a static Sites release adapter: Vite emits the client under `dist/client`, a minimal asset worker provides SPA fallback, and `.openai/hosting.json` binds the build to the Plainmark project without adding document processing or persistence.
- `[x]` Final Phase 7 local gate passes: clean lockfile install, 13 test files / 71 tests, ESLint, production build, zero-vulnerability audit, Sites archive validation, and diff whitespace validation.
- `[x]` Plainmark version 1 deployed successfully to `https://plainmark-viewer.mohitpandeyin.chatgpt.site` and public access was enabled for assignment evaluation.
- `[x]` Public smoke validation passes: HTTP 200 for the app/client asset/fallback route, complete 17 KB fixture upload and preview, replacement with the representative fixture, Start over back to the empty state, and zero browser console warnings.

### Code-block rich-paste compatibility postmortem - 2026-08-13

**Trigger and observed regressions**

- Adding read-only Notion language metadata was safe. The regressions began in the later presentation work that changed how individual code lines were represented inside the portable HTML.
- In Google Docs, `<br>` and per-line block runs were imported as paragraph-like boundaries. Docs applied its own paragraph spacing, producing large vertical gaps; line-level backgrounds also appeared fragmented instead of forming one rectangle.
- In Microsoft Word, a later per-line representation looked separated in the browser through CSS layout but no longer contained literal newline characters in one text payload. Word therefore joined the source lines.
- Notion showed the same joined-line symptom: the `<pre><code>` language/type metadata survived, but visual block boundaries could not substitute for missing newline characters in the code text.

**Diagnosis and root cause**

- The supplied Google Docs, Word, and Notion screenshots were compared against the generated `text/html` structure rather than treating this as a shared line-height problem.
- The key distinction was between an actual source newline (`\n`) and a visual break produced by `<br>` or `display:block`. Rich-text importers normalize those structures differently even when a browser renders them similarly.
- Exporting each line as its own block gave Google Docs multiple paragraph-like units, so its paragraph spacing and shading rules created the gaps and fragmented background.
- Replacing the source newlines with CSS-separated line elements fixed neither text fidelity nor portability: Word and Notion received flattened text because the literal newline characters were gone.
- The root cause was therefore the line-level clipboard DOM, not the declared code language, syntax highlighting, editor state, or normal document paragraph styles.

**Rejected intermediate approaches**

1. Styling the `<pre>` background directly did not produce a consistently connected rectangle after rich-editor normalization.
2. A separate outer wrapper improved Word's box but did not resolve Google Docs' handling of the line children.
3. Inserting `<br>` preserved visible breaks in some destinations but Google Docs interpreted them with excessive vertical spacing.
4. One block-level span per line reduced one symptom but converted true text newlines into CSS layout, which flattened the code in Word and Notion.

**Final targeted resolution**

- A single presentation table cell owns the entire code block's background, border, and padding, including Word-compatible `mso-*` hints.
- The semantic `<pre><code>` structure remains read-only and retains normalized Notion language metadata.
- One inline, zero-margin `pre-wrap` content run contains the exact source text with its indentation, intentional blank lines, and literal newline characters.
- No `<br>` elements or per-line block elements are generated, which removes the paragraph-like gaps. A controlled `1.45` line height gives each real code line a consistent rhythm, while safe wrapping and fixed-layout container rules handle long lines.
- The change is isolated to portable code serialization and styles; normal paragraphs, headings, lists, tables, and other document output are unchanged.

**Regression evidence**

- Serializer coverage asserts one connected presentation cell, one inline content run, no `<br>` elements, and exact code `textContent`, including indentation and an intentional blank line.
- Coverage also asserts that ordinary Markdown tables do not receive the code-container treatment.
- The complete local gate after the fix passed: 63 tests, lint, production build, and diff validation. The user then confirmed the destination behavior works.

### Blockquote rich-paste compatibility decision - 2026-08-13

**Screenshot findings and root cause**

- Microsoft Word and Google Docs retained the quote text, bold/italic content, nested list, and source order, but discarded the left border and indentation attached only to the semantic `<blockquote>` container.
- Once the container treatment was dropped, its child paragraphs inherited ordinary document paragraph spacing. Google Docs made that especially visible as large gaps between the incident principle, explanatory paragraph, nested note, and list; Word produced a flatter but still weak hierarchy.
- The supplied Notion reference showed the opposite behavior: Notion recognized the outer and nested semantic blockquotes and rendered native quote rules correctly.
- The root cause was therefore a destination mapping mismatch. The exporter styled the semantic container, while Word and Docs imported the quote's children as paragraph/list units whose paragraph properties drive spacing, indentation, borders, and shading.

**Research-backed approach**

- Microsoft documents indentation, before/after spacing, line spacing, borders, and shading as paragraph properties; Word paste may also adjust paragraph spacing depending on the selected paste mode.
- Google Docs exposes the same concepts at paragraph level, including left borders, indentation, paragraph spacing, border padding, and shading.
- A one-cell presentation table was rejected because it would be visually robust but could turn a semantic quote into a table and regress Notion's already-correct native blockquote conversion.
- Background fill was omitted because it was unnecessary for recognition and could be normalized into fragmented paragraph shading or text highlighting.

**Targeted resolution and validation**

- Semantic `<blockquote>` elements and nesting remain unchanged.
- Only direct quote paragraphs, lists, and nested blockquotes receive a matching `3px` left border, compact `1.5` line height, zero margin, and controlled left padding. Quote lists use extra inset for bullet readability, and Word receives equivalent `mso-*` border/padding hints.
- The preview renderer, plain-text serializer, and all elements outside blockquotes remain unchanged.
- The new regression test verifies two semantic quote levels, continuous paragraph/list border properties, list indentation, zero internal margins, and unchanged spacing for an ordinary paragraph and list.
- Local validation passes: 13 test files / 64 tests, lint, production build, and diff validation.

## 11. In-progress work

- None. The required assignment release is complete.

## 12. Pending work

- No required work remains. Optional follow-ups are listed in the root README.

## 13. Issues, blockers, and risks

### Active blocker

- None.

### Open decisions to finalize during planned phases

- `[x]` Exact tested browser versions recorded: Chrome 151.0.7922.137, Firefox 153.0.4, and Safari 26.6.
- `[x]` Static hosting provider and public URL: Sites at `https://plainmark-viewer.mohitpandeyin.chatgpt.site`.
- `[x]` Bounded syntax highlighting approved after P0 completion: local curated language set, no guessing, readable unknown-language fallback, and no preview UI in document export.

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
16. Phase 2 initially accepted one `.md` or `.markdown` file up to and including 5 MB based on intake-only benchmarks; Phase 6 complete-render evidence supersedes this limit.
17. The active document is committed only after validation and reading succeed; failed replacement never discards the previous valid document.
18. Phase 3 uses custom Markdown components only where behavior differs from native semantics: safe links, conservative image fallbacks, read-only tasks, and focusable table/code overflow wrappers.
19. Unsupported representative syntax remains intentionally literal/readable: admonitions are ordinary blockquotes, math is text, definition lists become paragraphs, raw HTML/comments are omitted, and syntax highlighting is deferred.
20. File-details metadata is rendered once and reused by the desktop sidebar and mobile native-dialog sheet; the sheet returns focus to its trigger on close.
21. Clipboard export clones only the semantic article, unwraps preview-only containers, converts task controls to text markers, strips application/unsafe attributes, and applies a deliberately small inline style map.
22. `text/markdown` is included only when the runtime reports support; a rejection retries rich HTML/plain without Markdown before using `writeText`.
23. Toast feedback owns clipboard outcomes and timers; document lifecycle state remains isolated in the document reducer.
24. Phase 6 limits v1 documents to 1 MB inclusive. A realistic exact-boundary document rendered in about 1.13 seconds, while pathologically dense structured Markdown was materially slower; advertising 5 MB was therefore not defensible.
25. Muted UI text uses `#66707c` and the focus ring uses `#0c765f` so small text and keyboard focus exceed AA contrast on the application's light surfaces.
26. The native details dialog remains rendered at desktop widths if it was opened before a resize; hiding an open modal with CSS is prohibited because it leaves the document inert and traps the user.
27. Clipboard representation order remains HTML before plain text so WebKit/macOS rich destinations prefer the structurally rich representation. TextEdit may convert that HTML to unstyled text even in a plain document; exact fallback validation must request `text/plain` explicitly rather than inferring it from visual styling.
28. Code highlighting uses `lowlight` 3.3.0 with a curated declared-language registry (JavaScript/TypeScript, Python, shell, Lua, JSON, YAML, SQL, CSS, XML/HTML, Markdown, and plain text). Automatic detection is intentionally disabled; unsupported languages remain readable.
29. Per-block code copy is preview-only and uses `navigator.clipboard.writeText` with a selection-copy fallback. The full-document serializers remove code toolbars so established Word/Docs/Notion/plain-text output does not gain UI labels or buttons.
30. Horizontal code/table regions implement Arrow Left/Right and Home/End scrolling rather than relying on browser-specific native overflow-key behavior.
31. The application shell uses explicit header-height and sidebar-width custom properties so fixed header/sidebar offsets, viewport-height calculations, and responsive content padding share one measured source of truth.
32. Code language is derived only from the Markdown fence and is not editable in the preview. Rich HTML retains normalized language metadata for Notion; Markdown/plain-text outputs and per-block copied code retain the exact source text.
33. Portable code export separates presentation from text semantics: one cell owns the connected box, while one inline `pre-wrap` run owns the literal code payload. A visual CSS break is not accepted as a substitute for a source newline, and per-line blocks or `<br>` elements are avoided because destination editors normalize them incompatibly.
34. Portable blockquote export keeps semantic nesting but mirrors visual treatment onto direct paragraph/list units because Word and Google Docs import paragraph properties more reliably than container styling. The fallback uses borders, indentation, and controlled spacing without a table wrapper or background fill, and its selector scope excludes ordinary document elements.
35. Element improvement Phase B1 is deliberately scoped to the rich HTML clone. Heading resets and pagination hints preserve semantic heading tags; task-marker cleanup targets only list items that contained checkbox inputs; unavailable-image presentation moves to one standalone paragraph; nested quotes retain both blockquote levels; and table work stops at semantic header hints. Dense-table reflow, forced column sizing, row-splitting rules, and bidi experiments remain deferred until isolated destination evidence justifies them.
36. Inline code remains character-level semantic `<code>` rather than using the fenced-code presentation table. Word Online preserved its monospace font but dropped the previous `background` shorthand, so the portable style now uses explicit `background-color`, inline display, inherited line height, and safe wrapping. Borders, radius, and exact padding remain best-effort destination formatting.
37. Rich blockquote hard breaks use `<br>` as the sole visual line boundary; adjacent parser formatting newlines are removed from the cloned HTML to prevent a synthetic leading space. The final segment of each outer quote owns the post-quote margin because Word and Docs import paragraph spacing more reliably than container margins.

### Element-improvement Phase B1 - 2026-08-13

**Diagnosis and scope**

- The full Word, Google Docs, and Notion screenshots showed a structurally sound baseline with a few isolated importer differences: lower Word heading styles could inherit italic/underline decoration, task items could show both a bullet and `[x]`/`[ ]`, media fallback styling could remain attached to an inline fragment, nested quote levels needed clearer distinction outside Notion, and table headings could become separated during pagination.
- These issues did not share one global typography cause. They occur because destination editors map semantic elements and inline CSS into different native paragraph/list/table models. A root font, paragraph, list, or table rewrite would therefore risk already-working content.
- The implementation follows `docs/elements-improvement.md` and changes only the affected cloned nodes during rich HTML serialization.

**Implemented resolution**

- All heading levels explicitly reset font style and text decoration while retaining their semantic tags; best-effort pagination hints were added without manual breaks.
- Checkbox inputs still become readable state markers, and only their owning task items suppress redundant native bullets.
- Standalone image fallbacks now become one padded, bordered paragraph with readable separators and the safe source link intact.
- Nested quote segments use a darker rule while preserving the outer and inner blockquote structure.
- Real table headers retain `<thead>` and receive conservative header-group/pagination hints; data rows and dense/wide table layout remain untouched.

**Validation**

- Focused serializer validation passes: 1 file / 10 tests, including new isolation assertions for headings, task versus ordinary list items, standalone media fallbacks, nested quotes, and table headers.
- Complete local gates pass: 13 test files / 68 tests, lint, production build, and diff whitespace validation.
- Full automated gates and manual Word/Google Docs/Notion destination validation are recorded separately; no destination result is claimed from DOM assertions alone.

### Inline-code Word refinement - 2026-08-13

**Screenshot finding and diagnosis**

- Google Docs retained the intended light background on inline code, including normal fragmenting when a long inline run wrapped.
- Word Online retained the semantic text, monospace font, source order, and wrapping but dropped the light background, border, radius, and padding.
- Fenced code remained correct in both destinations, so reusing the code-block table or changing generic `<code>` styling would have expanded the fix beyond the defect.
- The portable inline style used the `background` shorthand. Word exposes character/range shading in its document model, but its HTML importer did not map this shorthand in the supplied paste result.

**Targeted resolution**

- Inline semantic `<code>` now uses explicit `background-color`, `display:inline`, inherited line height, and safe wrap properties. The monospace stack, restrained border, radius, and padding remain, but those box details are treated as best effort.
- No wrapper, presentation table, line break, or block-level element was introduced. Surrounding prose and fenced code follow their existing serializers unchanged.

**Validation**

- The focused serializer suite passes: 1 file / 11 tests. The new assertion verifies explicit character background, inline flow, unmodified surrounding paragraph text, safe wrapping, and the unchanged fenced-code path.
- Complete local gates pass: 13 test files / 69 tests, lint, production build, and diff whitespace validation.
- The fresh Google Docs paste retains the light inline-code background and wraps long expressions correctly.
- The fresh Word Online paste retains monospace text, exact inline placement, and safe wrapping but still discards background/border/padding. This is now an accepted destination limitation; no proprietary Word-only wrapper or highlight treatment will be added.

### Plain-text blockquote hard-break correction - 2026-08-13

**Root cause and diagnosis**

- The VS Code paste was complete and structurally readable: all sections, code indentation, tab-separated tables, task markers, Unicode, safe link targets, and final content were present.
- Only the opening metadata quote showed `>  Audience` and `>  Last reviewed` with two spaces after the quote marker.
- A Markdown hard break renders as `<br>` followed by a formatting newline text node. The plain serializer already converted `<br>` to a real newline, then converted the adjacent formatting newline to a space. The blockquote prefix added its own required space, producing the duplicate.

**Targeted resolution**

- Text nodes immediately following `<br>` now discard only leading tab/newline characters before ordinary inline whitespace normalization.
- Meaningful spaces remain untouched, including the two-space indentation used by nested list items and all whitespace inside `<pre>` code blocks.

**Validation**

- Regression coverage asserts one space after the blockquote marker across a hard break and unchanged nested-list indentation inside the same quote.
- The existing full plain-text structure/code-whitespace test remains active.
- Complete local gates pass: 13 test files / 70 tests, lint, production build, and diff whitespace validation.

### Rich blockquote alignment and trailing rhythm - 2026-08-13

**Root cause and diagnosis**

- The refreshed plain-text paste confirmed the prior correction: opening metadata lines now use exactly one space after `>`.
- In Word rich paste, the same source hard breaks still showed a visual leading space on the second and third lines because the cloned HTML retained a formatting newline immediately after each `<br>`.
- Word also placed the following paragraph directly against the quote. The exporter put external spacing on `<blockquote>`, but Word discarded that container margin while honoring the zero-margin child paragraph.

**Targeted resolution**

- Rich HTML normalization now removes only leading tab/newline characters from a text node immediately following `<br>`. It does not remove real spaces or alter code payloads.
- The final direct paragraph/list segment of each outer quote receives a standard `16px` bottom margin. Nested quote segments keep zero external margin, and ordinary paragraphs remain unchanged.

**Validation boundary**

- Regression coverage verifies two hard breaks without leading formatting whitespace, one post-quote margin, unchanged following-paragraph styling, and unchanged nested quote/list behavior.
- Complete local gates pass: 13 test files / 71 tests, lint, production build, and diff whitespace validation.
- Word, Google Docs, and Notion require one fresh paste to confirm destination rendering.

### Complex-fixture destination regression - 2026-08-12

- Firefox rich copy pasted the complete fixture, now published as `public/sample-file.md`, into both Google Docs and Microsoft Word Online through **12. Completion record** and the final **End of complex rendering fixture** text.
- Both destinations recognized the heading hierarchy and populated their document navigation/outline surfaces across the deeply nested section structure.
- Ordered, unordered, mixed, deeply nested, and task lists remained structurally readable. Portable task states remained `[x]` / `[ ]` markers, as designed for cross-editor consistency.
- Code blocks retained monospace content, exact line structure, and useful color distinctions where the destination preserved source colors. Plainmark's language labels and per-block Copy/Copied controls were correctly omitted from copied document content.
- Compact and wide tables remained structured. Very wide operational and long-cell tables became tall and tightly wrapped on portrait pages; this is destination-controlled pagination/layout rather than content loss and does not justify editor-specific table markup.
- Links and long URLs remained visible and wrapped; inline emphasis/code, blockquotes, horizontal rules, multilingual text, Unicode, and emoji remained readable.
- The repeated outline/navigation fragments visible in the supplied long screenshots are fixed-sidebar screenshot stitching, not duplicated main document content.
- No compatibility fix is required from this regression pass.

## 15. Next steps

1. Submit the public repository URL, public application URL, and concise handoff from `docs/SUBMISSION.md` through the assignment form.
2. Treat all future work as optional enhancement or maintenance and preserve the documented compatibility boundaries.
