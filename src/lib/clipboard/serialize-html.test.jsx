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

    expect(exportedDocument.querySelector('[class]:not(code)')).toBeNull()
    expect(
      exportedDocument.querySelector('code.language-javascript'),
    ).not.toBeNull()
    expect(html).not.toContain('aria-')
    expect(html).not.toContain('tabindex')
    expect(html).not.toContain('var(--')
    expect(exportedDocument.querySelector('input')).toBeNull()
    expect(exportedDocument.querySelector('button')).toBeNull()
    expect(exportedDocument.querySelector('select')).toBeNull()
    expect(exportedDocument.textContent).not.toContain('JavaScriptCopy')
    expect(exportedDocument.textContent).not.toContain('Plain textCSSHTML')
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

  it('preserves read-only Notion language metadata in portable HTML', () => {
    render(
      <MarkdownDocument
        resetKey="language-metadata"
        source={'```js\nconst exported = true\n```\n\n```csharp\nvar count = 1;\n```'}
      />,
    )

    const html = serializePortableHtml(
      screen.getByRole('article', { name: 'Rendered Markdown document' }),
    )
    const exportedDocument = parseHtml(html)
    const codeBlocks = exportedDocument.querySelectorAll('pre > code')

    expect(codeBlocks).toHaveLength(2)
    expect(codeBlocks[0].className).toBe('language-javascript')
    expect(codeBlocks[0].getAttribute('data-language')).toBe('javascript')
    expect(codeBlocks[0].parentElement.getAttribute('data-code-language')).toBe(
      'javascript',
    )
    expect(codeBlocks[0].textContent).toBe('const exported = true\n')
    expect(codeBlocks[0].querySelector('span')).toBeNull()
    expect(codeBlocks[1].className).toBe('language-csharp')
    expect(codeBlocks[1].getAttribute('data-code-language')).toBe('c#')
    expect(exportedDocument.querySelector('select')).toBeNull()
    expect(exportedDocument.textContent).not.toContain('JavaScriptCopy')
  })

  it('uses a responsive rectangular treatment for document editors', () => {
    render(
      <MarkdownDocument
        resetKey="code-style"
        source={'```typescript\nconst veryLongIdentifier = "value"\n```'}
      />,
    )

    const html = serializePortableHtml(
      screen.getByRole('article', { name: 'Rendered Markdown document' }),
    )
    const codeBlock = parseHtml(html).querySelector('pre')

    expect(codeBlock.style.display).toBe('block')
    expect(codeBlock.style.maxWidth).toBe('100%')
    expect(codeBlock.style.backgroundColor).toBe('rgb(246, 248, 250)')
    expect(codeBlock.style.borderStyle).toBe('solid')
    expect(codeBlock.style.padding).toBe('16px 18px')
    expect(codeBlock.style.whiteSpace).toBe('pre-wrap')
    expect(codeBlock.style.overflowX).toBe('auto')
    expect(codeBlock.style.overflowWrap).toBe('anywhere')
  })
})
