import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MarkdownDocument } from './markdown-document.jsx'

const prose =
  'This paragraph describes a production architecture decision, its operational constraints, expected failure modes, measured tradeoffs, and rollout safeguards. '

const section = `
## Representative section

${prose.repeat(110)}

This summary combines **strong text**, *emphasis*, ~~deleted text~~, and an
[external link](https://example.com/docs).

- First item with \`inline code\`
- Second item
  1. Nested ordered item
  2. Another nested item

> A short operational note with complete readable context.

| Name | State | Count |
| --- | --- | ---: |
| Alpha | Ready | 12 |
| Beta | Waiting | 3 |

\`\`\`js
function allowRequest(input) {
  return input.enabled && input.remaining > 0
}
\`\`\`

`

export function createLargeTechnicalDocument(byteLength) {
  const repetitions = Math.ceil(byteLength / section.length)
  return {
    repetitions,
    source: section.repeat(repetitions),
  }
}

describe('large Markdown document', () => {
  it(
    'renders a representative one-megabyte document within the interaction budget',
    () => {
      const { repetitions, source } = createLargeTechnicalDocument(1024 * 1024)
      const startedAt = performance.now()
      const { container } = render(
        <MarkdownDocument resetKey="large-document" source={source} />,
      )
      const elapsed = performance.now() - startedAt

      expect(new Blob([source]).size).toBeGreaterThanOrEqual(1024 * 1024)
      expect(container.querySelectorAll('h2')).toHaveLength(repetitions)
      // Keep CI variance from making the test flaky; the real-browser target is
      // measured separately against the product's one-second usability goal.
      expect(elapsed).toBeLessThan(2_000)
    },
    15_000,
  )
})
