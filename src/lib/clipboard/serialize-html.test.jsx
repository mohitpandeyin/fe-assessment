import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import requiredElements from '../../test/fixtures/required-elements.md?raw'
import { MarkdownDocument } from '../../features/markdown/markdown-document.jsx'
import { serializePortableHtml } from './serialize-html.js'

function parseHtml(html) {
  const template = document.createElement('template')
  template.innerHTML = html
  return template.content
}

describe('serializePortableHtml', () => {
  it('creates self-contained semantic HTML without preview-only markup', () => {
    render(<MarkdownDocument resetKey="html" source={requiredElements} />)
    const article = screen.getByRole('article', {
      name: 'Rendered Markdown document',
    })
    const html = serializePortableHtml(article)
    const exportedDocument = parseHtml(html)

    expect(exportedDocument.querySelector('h1').textContent).toBe('Heading one')
    expect(exportedDocument.querySelector('table')).not.toBeNull()
    expect(exportedDocument.querySelector('thead')).not.toBeNull()
    expect(exportedDocument.querySelector('pre > code').textContent).toContain(
      'preserve    spacing',
    )
    expect(exportedDocument.querySelector('th:nth-child(2)').style.textAlign).toBe(
      'center',
    )
    expect(exportedDocument.textContent).toContain('[x] Completed task')
    expect(exportedDocument.textContent).toContain('[ ] Incomplete task')

    expect(html).not.toContain('class=')
    expect(html).not.toContain('aria-')
    expect(html).not.toContain('tabindex')
    expect(html).not.toContain('var(--')
    expect(exportedDocument.querySelector('input')).toBeNull()
    expect(exportedDocument.querySelector('button')).toBeNull()
    expect(exportedDocument.querySelector('script')).toBeNull()
  })

  it('preserves only validated navigable links', () => {
    render(<MarkdownDocument resetKey="links" source={requiredElements} />)
    const html = serializePortableHtml(
      screen.getByRole('article', { name: 'Rendered Markdown document' }),
    )
    const exportedDocument = parseHtml(html)

    expect(
      exportedDocument.querySelector('a[href="https://example.com/docs"]')
        .textContent,
    ).toBe('external link')
    expect(exportedDocument.querySelector('a[href*="guide.md"]')).toBeNull()
    expect(exportedDocument.querySelector('a[href^="javascript:"]')).toBeNull()
    expect(
      exportedDocument.querySelector(
        'a[href="https://images.example.com/diagram.png"]',
      ).textContent,
    ).toBe('View image source')
  })
})
