import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import requiredElements from '../../test/fixtures/required-elements.md?raw'
import { MarkdownDocument } from '../../features/markdown/markdown-document.jsx'
import { serializePlainText } from './serialize-plain-text.js'

describe('serializePlainText', () => {
  it('preserves readable document structure and exact code whitespace', () => {
    render(<MarkdownDocument resetKey="plain" source={requiredElements} />)
    const plainText = serializePlainText(
      screen.getByRole('article', { name: 'Rendered Markdown document' }),
    )

    expect(plainText).toContain('Heading one\n\nHeading two')
    expect(plainText).toContain('- Unordered item')
    expect(plainText).toContain('  - Nested unordered item')
    expect(plainText).toContain('- [x] Completed task')
    expect(plainText).toContain('- [ ] Incomplete task')
    expect(plainText).toContain('1. Ordered item')
    expect(plainText).toContain('> A quoted paragraph with formatting.')
    expect(plainText).toContain('Name\tState\tCount')
    expect(plainText).toContain('Alpha\tReady\t12')
    expect(plainText).toContain('preserve    spacing')
    expect(plainText).toContain(
      'external link (https://example.com/docs)',
    )
    expect(plainText).not.toContain('<h1>')
    expect(plainText).not.toContain('JavaScriptCopy')
  })
})
