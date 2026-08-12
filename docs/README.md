# Project Documentation

This folder is the source of truth for the Markdown rendering application before planning and implementation begin.

## Documents

- [Product Requirements Document](./PRD.md) - product vision, scope, requirements, acceptance criteria, and future direction.
- [Project Context and Decision Memory](./PROJECT_CONTEXT.md) - durable context, confirmed constraints, working decisions, and unresolved questions for future contributors.
- [UI Specification](./UI_SPECIFICATION.md) - locked Direction C screen structure, responsive behavior, component anatomy, content labels, and UI acceptance criteria.
- [Design System](./DESIGN_SYSTEM.md) - approved visual foundations, tokens, typography, component patterns, and Markdown presentation rules.
- [Frontend Architecture](./FRONTEND_ARCHITECTURE.md) - approved React/Tailwind/CSS boundaries, custom-component strategy, dependency budget, and code-quality guardrails.
- [Content Rendering and Rich-Copy Contract](./CONTENT_RENDERING_AND_COPY.md) - semantic element behavior, portable clipboard formatting, cross-editor expectations, and validation criteria.
- [Locked Direction C reference](./assets/direction-c-locked.png) - approved visual reference with the file-details/Start-over sidebar.
- [First-visit desktop reference](./assets/first-visit-desktop.png) - dedicated landing/empty state before a file is selected.
- [Original Direction C exploration](./assets/direction-c-exploration.png) - retained for decision provenance; its TOC sidebar is not part of v1.

## Source hierarchy

When requirements appear to conflict, use this order:

1. The original [Frontend Developer Assignment](../requirements/Frontend_Developer_Assignment.pdf).
2. The [Product Requirements Document](./PRD.md), which interprets and makes the assignment testable.
3. The [open test case](../requirements/open_test_case.md), which is representative input rather than a complete specification.
4. The content rendering and rich-copy contract for element semantics, portability, and paste acceptance.
5. The UI specification and design system for presentation and interaction decisions.
6. The project context document and later implementation plans.

The PRD should be updated before development whenever a product decision changes. Implementation plans and code must not silently redefine product behavior.
