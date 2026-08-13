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

  it('uses explicit character shading for inline code without changing fenced code', () => {
    render(
      <MarkdownDocument
        resetKey="inline-code-style"
        source={
          'Before `calculateRegionalAvailability()` after.\n\n```javascript\nconst unchanged = true\n```'
        }
      />,
    )

    const exportedDocument = parseHtml(
      serializePortableHtml(
        screen.getByRole('article', { name: 'Rendered Markdown document' }),
      ),
    )
    const inlineCode = exportedDocument.querySelector('p > code')
    const fencedCode = exportedDocument.querySelector('pre > code')

    expect(inlineCode.textContent).toBe('calculateRegionalAvailability()')
    expect(inlineCode.style.backgroundColor).toBe('rgb(244, 245, 243)')
    expect(inlineCode.style.display).toBe('inline')
    expect(inlineCode.style.fontFamily).toContain('Consolas')
    expect(inlineCode.style.lineHeight).toBe('inherit')
    expect(inlineCode.style.overflowWrap).toBe('anywhere')
    expect(inlineCode.style.whiteSpace).toBe('normal')
    expect(inlineCode.style.wordBreak).toBe('break-word')
    expect(inlineCode.parentElement.textContent).toBe(
      'Before calculateRegionalAvailability() after.',
    )

    expect(fencedCode.style.backgroundColor).toBe('')
    expect(fencedCode.style.display).toBe('block')
    expect(fencedCode.textContent).toBe('const unchanged = true')
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

  it('applies quote spacing and borders to imported paragraphs without changing ordinary content', () => {
    render(
      <MarkdownDocument
        resetKey="blockquote-style"
        source={
          '> **Incident principle**\n>\n> Restore service first.\n>\n> > **Nested note:** Preserve context.\n>\n> - Known\n> - Unknown\n\nOrdinary paragraph.\n\n- Ordinary list item'
        }
      />,
    )

    const html = serializePortableHtml(
      screen.getByRole('article', { name: 'Rendered Markdown document' }),
    )
    const exportedDocument = parseHtml(html)
    const outerQuote = exportedDocument.querySelector('blockquote')
    const quoteParagraphs = outerQuote.querySelectorAll(':scope > p')
    const nestedQuote = outerQuote.querySelector(':scope > blockquote')
    const quoteList = outerQuote.querySelector(':scope > ul')
    const ordinaryParagraph = Array.from(
      exportedDocument.querySelectorAll('p'),
    ).find((paragraph) => paragraph.textContent === 'Ordinary paragraph.')
    const ordinaryList = Array.from(
      exportedDocument.querySelectorAll('ul'),
    ).find((list) => list.textContent.includes('Ordinary list item'))

    expect(exportedDocument.querySelectorAll('blockquote')).toHaveLength(2)
    expect(outerQuote.style.borderLeftStyle).toBe('')
    expect(outerQuote.style.padding).toBe('0px')
    expect(quoteParagraphs).toHaveLength(2)

    for (const paragraph of quoteParagraphs) {
      expect(paragraph.style.borderLeftStyle).toBe('solid')
      expect(paragraph.style.borderLeftWidth).toBe('3px')
      expect(paragraph.style.lineHeight).toBe('1.5')
      expect(paragraph.style.margin).toBe('0px')
      expect(paragraph.style.paddingLeft).toBe('14px')
    }

    expect(nestedQuote.style.borderLeftStyle).toBe('solid')
    expect(nestedQuote.style.margin).toBe('0px')
    const nestedParagraph = nestedQuote.querySelector(':scope > p')
    expect(nestedParagraph.style.borderLeftStyle).toBe('solid')
    expect(nestedParagraph.style.borderLeftColor).toBe('rgb(143, 153, 164)')
    expect(quoteList.style.borderLeftStyle).toBe('solid')
    expect(quoteList.style.marginTop).toBe('0px')
    expect(quoteList.style.marginBottom).toBe('16px')
    expect(quoteList.style.paddingLeft).toBe('42px')
    expect(quoteList.getAttribute('style')).toContain('mso-border-left-alt:')

    expect(ordinaryParagraph.style.borderLeftStyle).toBe('')
    expect(ordinaryParagraph.style.marginBottom).toBe('16px')
    expect(ordinaryList.style.borderLeftStyle).toBe('')
    expect(ordinaryList.style.marginBottom).toBe('18px')
    expect(ordinaryList.style.paddingLeft).toBe('28px')
  })

  it('normalizes quote hard breaks and preserves one post-quote paragraph gap', () => {
    render(
      <MarkdownDocument
        resetKey="blockquote-hard-breaks"
        source={
          '> **Status:** Review candidate  \n> **Audience:** Incident commanders  \n> Last reviewed: Today\n\nFollowing paragraph.'
        }
      />,
    )

    const exportedDocument = parseHtml(
      serializePortableHtml(
        screen.getByRole('article', { name: 'Rendered Markdown document' }),
      ),
    )
    const quote = exportedDocument.querySelector('blockquote')
    const quoteParagraph = quote.querySelector(':scope > p')
    const hardBreaks = quoteParagraph.querySelectorAll('br')
    const followingParagraph = Array.from(
      exportedDocument.querySelectorAll('p'),
    ).find((paragraph) => paragraph.textContent === 'Following paragraph.')

    expect(hardBreaks).toHaveLength(2)
    for (const hardBreak of hardBreaks) {
      expect(hardBreak.nextSibling?.nodeValue ?? '').not.toMatch(/^[\t\r\n]/)
    }
    expect(quoteParagraph.innerHTML).not.toMatch(/<br>\s+/)
    expect(quoteParagraph.style.marginTop).toBe('0px')
    expect(quoteParagraph.style.marginBottom).toBe('16px')
    expect(followingParagraph.style.marginBottom).toBe('16px')
  })

  it('keeps headings upright and supplies non-destructive pagination hints', () => {
    render(
      <MarkdownDocument
        resetKey="heading-export"
        source={'# One\n\n## Two\n\n### Three\n\n#### Four\n\n##### Five\n\n###### Six\n\nBody'}
      />,
    )

    const exportedDocument = parseHtml(
      serializePortableHtml(
        screen.getByRole('article', { name: 'Rendered Markdown document' }),
      ),
    )
    const headings = exportedDocument.querySelectorAll('h1, h2, h3, h4, h5, h6')

    expect(headings).toHaveLength(6)
    for (const heading of headings) {
      expect(heading.style.fontStyle).toBe('normal')
      expect(heading.style.textDecoration).toBe('none')
      expect(heading.style.pageBreakAfter).toBe('avoid')
      expect(heading.style.breakAfter).toBe('avoid-page')
    }
  })

  it('removes only redundant task bullets while keeping state and ordinary list markers', () => {
    render(
      <MarkdownDocument
        resetKey="task-export"
        source={'- [x] Complete\n  - [ ] Nested pending\n\n- Ordinary item'}
      />,
    )

    const exportedDocument = parseHtml(
      serializePortableHtml(
        screen.getByRole('article', { name: 'Rendered Markdown document' }),
      ),
    )
    const taskItems = Array.from(exportedDocument.querySelectorAll('li')).filter(
      (item) => /^\[(?:x| )\]/.test(item.textContent.trim()),
    )
    const ordinaryItem = Array.from(exportedDocument.querySelectorAll('li')).find(
      (item) => item.textContent.trim() === 'Ordinary item',
    )

    expect(taskItems).toHaveLength(2)
    expect(taskItems[0].textContent).toContain('[x] Complete')
    expect(taskItems[1].textContent).toContain('[ ] Nested pending')
    for (const item of taskItems) {
      expect(item.style.listStyleType).toBe('none')
      expect(item.style.margin).toBe('4px 0px')
    }
    expect(ordinaryItem.style.listStyleType).toBe('')
    expect(ordinaryItem.style.margin).toBe('4px 0px')
    expect(exportedDocument.querySelector('input')).toBeNull()
  })

  it('uses one paragraph-level media fallback with separated readable content', () => {
    render(
      <MarkdownDocument
        resetKey="media-export"
        source={'![Incident control plane](https://images.example.com/diagram.png)'}
      />,
    )

    const exportedDocument = parseHtml(
      serializePortableHtml(
        screen.getByRole('article', { name: 'Rendered Markdown document' }),
      ),
    )
    const fallback = Array.from(exportedDocument.querySelectorAll('p')).find(
      (paragraph) => paragraph.textContent.includes('Image not loaded:'),
    )

    expect(fallback.querySelector('.markdown-image-fallback')).toBeNull()
    expect(fallback.textContent).toBe(
      'Image not loaded: Incident control plane — View image source',
    )
    expect(fallback.style.backgroundColor).toBe('rgb(246, 248, 250)')
    expect(fallback.style.borderStyle).toBe('solid')
    expect(fallback.style.lineHeight).toBe('1.5')
    expect(fallback.style.padding).toBe('10px 12px')
    expect(fallback.getAttribute('style')).toContain('mso-border-alt:')
    expect(
      fallback.querySelector('a[href="https://images.example.com/diagram.png"]'),
    ).not.toBeNull()
  })

  it('marks semantic table headers for repetition without changing data rows', () => {
    render(
      <MarkdownDocument
        resetKey="table-pagination"
        source={'| Key | Value |\n| --- | --- |\n| state | recovering |'}
      />,
    )

    const exportedDocument = parseHtml(
      serializePortableHtml(
        screen.getByRole('article', { name: 'Rendered Markdown document' }),
      ),
    )
    const tableHead = exportedDocument.querySelector('thead')
    const dataRow = exportedDocument.querySelector('tbody > tr')

    expect(tableHead.style.display).toBe('table-header-group')
    expect(tableHead.style.pageBreakAfter).toBe('avoid')
    expect(tableHead.style.breakAfter).toBe('avoid')
    expect(dataRow.style.pageBreakInside).toBe('')
  })
})
