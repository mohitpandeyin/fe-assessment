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

function getCodeText(code) {
  return code.textContent
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
        source={
          '```js\nconst exported = true\nconsole.log(exported)\n```\n\n```csharp\nvar count = 1;\n```'
        }
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
    expect(getCodeText(codeBlocks[0])).toBe(
      'const exported = true\nconsole.log(exported)',
    )
    expect(codeBlocks[0].querySelector('br')).toBeNull()
    expect(codeBlocks[0].querySelectorAll('span')).toHaveLength(1)
    expect(codeBlocks[0].querySelector('span').style.display).toBe('')
    expect(codeBlocks[0].querySelector('span').style.margin).toBe('0px')
    expect(codeBlocks[0].querySelector('span').style.whiteSpace).toBe(
      'pre-wrap',
    )
    expect(codeBlocks[0].querySelector('span').textContent).toContain('\n')
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
    const exportedDocument = parseHtml(html)
    const codeContainer = exportedDocument.querySelector('table > tbody > tr > td')
    const codeTable = codeContainer.closest('table')
    const codeBlock = codeContainer.querySelector('pre')

    expect(codeTable.style.borderCollapse).toBe('collapse')
    expect(codeTable.style.tableLayout).toBe('fixed')
    expect(codeTable.style.width).toBe('100%')
    expect(codeContainer.style.backgroundColor).toBe('rgb(246, 248, 250)')
    expect(codeContainer.style.borderStyle).toBe('solid')
    expect(codeContainer.style.padding).toBe('16px 18px')
    expect(codeContainer.getAttribute('style')).toContain('mso-border-alt:')
    expect(codeContainer.getAttribute('style')).toContain('mso-padding-alt:')
    expect(codeBlock.style.margin).toBe('0px')
    expect(codeBlock.style.padding).toBe('0px')
    expect(codeBlock.style.borderStyle).toBe('none')
    expect(codeBlock.style.backgroundColor).toBe('transparent')
    expect(codeBlock.style.whiteSpace).toBe('normal')
    expect(codeBlock.style.overflowWrap).toBe('anywhere')
    expect(codeBlock.querySelector('code').style.whiteSpace).toBe('normal')
    expect(codeBlock.querySelector('br')).toBeNull()
    expect(codeBlock.querySelectorAll('.portable-code-content')).toHaveLength(0)
  })

  it('keeps exact source newlines in one code run without changing other tables', () => {
    render(
      <MarkdownDocument
        resetKey="line-spacing"
        source={'```python\nfirst()\n  second()\n\nthird()\n```\n\n| A | B |\n| - | - |\n| 1 | 2 |'}
      />,
    )

    const html = serializePortableHtml(
      screen.getByRole('article', { name: 'Rendered Markdown document' }),
    )
    const exportedDocument = parseHtml(html)
    const code = exportedDocument.querySelector('pre > code')
    const codeContent = code.querySelector('span')

    expect(code.children).toHaveLength(1)
    expect(codeContent.style.display).toBe('')
    expect(codeContent.style.lineHeight).toBe('1.45')
    expect(codeContent.style.whiteSpace).toBe('pre-wrap')
    expect(codeContent.textContent).toBe('first()\n  second()\n\nthird()')
    expect(code.querySelector('br')).toBeNull()
    expect(getCodeText(code)).toBe('first()\n  second()\n\nthird()')
    expect(exportedDocument.querySelectorAll('table')).toHaveLength(2)
    expect(exportedDocument.querySelectorAll('table')[1].querySelectorAll('td')).toHaveLength(2)
  })
})
