# Plainmark submission handoff

Use the text below for the assignment form.

## Repository

https://github.com/mohitpandeyin/fe-assessment

## Hosted application

https://plainmark-viewer.mohitpandeyin.chatgpt.site

## Concise project explanation

Plainmark is a browser-only React application for opening one local Markdown file, reading a polished GitHub-Flavored Markdown preview, and copying the complete document to rich-text or plain-text destinations. Run it locally with Node.js 20.19+ (or 22.13+), `npm ci`, and `npm run dev`; use `npm run test:run`, `npm run lint`, and `npm run build` for the release gates.

The interface is intentionally a focused read-only tool rather than an editor. `react-markdown` and `remark-gfm` provide the safe semantic baseline, Tailwind handles responsive composition, and authored CSS owns the document typography and reusable component states. Clipboard export is implemented separately from preview styling: one action writes portable semantic HTML and semantic plain text, plus the exact Markdown source when the browser supports `text/markdown`. The rich output was iteratively validated in Microsoft Word, Google Docs, and Notion; VS Code was used to validate the exact plain-text representation.

All document processing stays in the browser tab. There is no backend, upload, persistence, analytics, or content network request. Raw HTML is disabled, unsafe links are inert, and remote images degrade to readable alt text and a safe source link instead of being fetched.

OpenAI Codex was used for planning, implementation, tests, compatibility research, documentation, and diagnosis. Human-reviewed destination screenshots and repeatable local gates remained the acceptance evidence. Root causes—including the difference between literal code newlines and editor-created paragraph gaps—are documented in the repository so I can explain the technical decisions and rejected alternatives.

With additional time I would add browser-level clipboard automation, opt-in privacy-explicit image embedding, a generated table of contents, broader declared-language highlighting, and carefully isolated table-export improvements. Current limitations are documented in the README, including the 1 MB file limit, deliberately unsupported raw HTML/math/Mermaid, destination-controlled paste styling, and Word Online dropping inline-code background while retaining monospace text and wrapping.
