import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import openTestCase from '../../../requirements/open_test_case.md?raw'
import malformedElements from '../../test/fixtures/malformed-elements.md?raw'
import requiredElements from '../../test/fixtures/required-elements.md?raw'
import { MarkdownDocument } from './markdown-document.jsx'
import { MarkdownErrorBoundary } from './markdown-error-boundary.jsx'

const complexRenderingTest = readFileSync(
  resolve(process.cwd(), 'public/sample-file.md'),
  'utf8',
)

describe('MarkdownDocument', () => {
  it('renders every required Markdown element with semantic structure', () => {
    const { container } = render(
      <MarkdownDocument resetKey="required" source={requiredElements} />,
    )
    const document = screen.getByRole('article', {
      name: 'Rendered Markdown document',
    })

    for (let level = 1; level <= 6; level += 1) {
      expect(
        within(document).getByRole('heading', { level }),
      ).toBeInTheDocument()
    }

    expect(container.querySelector('strong')).toHaveTextContent('strong')
    expect(container.querySelector('em')).toHaveTextContent('emphasis')
    expect(container.querySelector('del')).toHaveTextContent('deleted text')
    expect(container.querySelector('p > code')).toHaveTextContent('inline code')
    expect(container.querySelector('blockquote')).toBeInTheDocument()
    expect(container.querySelectorAll('ol').length).toBeGreaterThanOrEqual(2)
    expect(container.querySelectorAll('ul').length).toBeGreaterThanOrEqual(2)

    const tableRegion = screen.getByRole('region', {
      name: 'Scrollable table',
    })
    expect(tableRegion).toHaveAttribute('tabindex', '0')
    expect(within(tableRegion).getByRole('table')).toBeInTheDocument()
    const tableHeaders = within(tableRegion).getAllByRole('columnheader')
    expect(tableHeaders).toHaveLength(3)
    expect(tableHeaders[1]).toHaveStyle({ textAlign: 'center' })
    expect(tableHeaders[2]).toHaveStyle({ textAlign: 'right' })

    const codeRegions = screen.getAllByRole('region', {
      name: /Scrollable .*code block/,
    })
    expect(codeRegions).toHaveLength(3)
    expect(codeRegions[0]).toHaveAttribute('tabindex', '0')
    expect(codeRegions[0].querySelector('pre > code').textContent).toContain(
      'preserve    spacing',
    )
    expect(codeRegions[0]).toHaveAccessibleName(
      'Scrollable JavaScript code block',
    )
    expect(codeRegions[0].querySelector('.hljs-keyword')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Copy JavaScript code' }),
    ).toBeInTheDocument()
    expect(codeRegions[1].querySelector('code')).toHaveClass(
      'language-plaintext',
    )
    expect(codeRegions[2].querySelector('code')).toHaveClass(
      'language-plaintext',
    )
    expect(codeRegions[0].querySelector('pre')).toHaveAttribute(
      'data-code-language',
      'javascript',
    )
    expect(codeRegions[0].querySelector('code')).toHaveAttribute(
      'data-language',
      'javascript',
    )
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()

    expect(screen.getByLabelText('Completed task')).toBeChecked()
    expect(screen.getByLabelText('Completed task')).toBeDisabled()
    expect(screen.getByLabelText('Incomplete task')).not.toBeChecked()
  })

  it('isolates external links and makes local or unsafe links inert', () => {
    render(<MarkdownDocument resetKey="links" source={requiredElements} />)

    expect(screen.getByRole('link', { name: 'external link' })).toHaveAttribute(
      'href',
      'https://example.com/docs',
    )
    expect(screen.getByRole('link', { name: 'external link' })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    )
    expect(screen.getByRole('link', { name: 'external link' })).toHaveAttribute(
      'target',
      '_blank',
    )
    expect(screen.queryByRole('link', { name: 'local link' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'unsafe link' })).not.toBeInTheDocument()
    expect(screen.getByText('local link')).toHaveClass('markdown-link-unavailable')
    expect(screen.getByText('unsafe link')).toHaveClass('markdown-link-unavailable')
  })

  it('does not fetch images and provides readable source-aware fallbacks', () => {
    const { container } = render(
      <MarkdownDocument resetKey="images" source={requiredElements} />,
    )

    expect(container.querySelector('img')).not.toBeInTheDocument()
    expect(screen.getByText('Remote diagram')).toBeVisible()
    expect(screen.getByText('Local diagram')).toBeVisible()
    expect(screen.getByRole('link', { name: 'View image source' })).toHaveAttribute(
      'href',
      'https://images.example.com/diagram.png',
    )
    expect(screen.getByText('Local assets are unavailable.')).toBeVisible()
  })

  it('keeps malformed syntax readable without throwing', () => {
    const { container } = render(
      <MarkdownDocument resetKey="malformed" source={malformedElements} />,
    )

    expect(
      screen.getByRole('heading', { name: 'Before malformed content' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/This emphasis is/)).toBeVisible()
    expect(screen.getByText(/fenceWasNeverClosed/)).toBeVisible()
    expect(container.querySelector('script')).not.toBeInTheDocument()
  })

  it('degrades optional syntax to readable text and omits raw HTML', () => {
    const source = `$$value$$\n\nTerm\n: definition\n\n> [!NOTE]\n> Readable note content.\n\n<script>window.markdownExecuted = true</script>`
    const { container } = render(
      <MarkdownDocument resetKey="optional" source={source} />,
    )

    expect(screen.getByText('$$value$$')).toBeVisible()
    expect(screen.getByText(/Term/)).toBeVisible()
    expect(screen.getByText(/definition/)).toBeVisible()
    expect(screen.getByText(/Readable note content/)).toBeVisible()
    expect(container.querySelector('script')).not.toBeInTheDocument()
    expect(screen.queryByText(/markdownExecuted/)).not.toBeInTheDocument()
    expect(globalThis.markdownExecuted).toBeUndefined()
  })

  it('renders the complete representative fixture without a localized error', () => {
    render(<MarkdownDocument resetKey="complete" source={openTestCase} />)

    expect(
      screen.getByRole('heading', {
        name: 'Distributed Rate Limiting: A Technical Design Review',
      }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('table')).toHaveLength(2)
    expect(
      screen.getAllByRole('region', { name: /Scrollable .*code block/ }),
    ).toHaveLength(4)
    expect(screen.queryByText('Preview unavailable')).not.toBeInTheDocument()
  })

  it('renders the deliberately complex fixture with robust semantics', () => {
    const { container } = render(
      <MarkdownDocument resetKey="complex" source={complexRenderingTest} />,
    )
    const document = screen.getByRole('article', {
      name: 'Rendered Markdown document',
    })

    for (let level = 1; level <= 6; level += 1) {
      expect(within(document).getAllByRole('heading', { level }).length).toBeGreaterThan(0)
    }

    expect(screen.getAllByRole('table')).toHaveLength(4)
    expect(
      screen.getAllByRole('region', { name: /Scrollable .*code block/ }),
    ).toHaveLength(10)
    expect(screen.getAllByRole('checkbox').length).toBeGreaterThanOrEqual(15)
    expect(container.querySelectorAll('.task-list-item .task-list-item').length).toBeGreaterThan(0)
    expect(container.querySelectorAll('.hljs').length).toBeGreaterThanOrEqual(6)
    expect(screen.getByText(/सेवा बहाली/)).toBeVisible()
    expect(screen.getByText(/PLAINMARK_SUPERLONGTOKEN/)).toBeVisible()
    expect(container.querySelector('iframe')).not.toBeInTheDocument()
    expect(screen.queryByText(/private implementation note/)).not.toBeInTheDocument()
    expect(screen.queryByText('Preview unavailable')).not.toBeInTheDocument()
  })

  it('copies one code block with accessible local feedback', async () => {
    const user = userEvent.setup()
    const writeText = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockResolvedValue()

    render(
      <MarkdownDocument
        resetKey="copy-code"
        source={'```javascript\nconst copied = true\n```'}
      />,
    )

    await user.click(
      screen.getByRole('button', { name: 'Copy JavaScript code' }),
    )

    expect(writeText).toHaveBeenCalledWith('const copied = true')
    expect(
      screen.getByRole('button', { name: 'JavaScript code copied' }),
    ).toHaveTextContent('Copied')
  })

  it('maps fence aliases to fixed Notion language metadata', () => {
    render(
      <MarkdownDocument
        resetKey="notion-languages"
        source={
          '```csharp\nvar active = true;\n```\n\n```notion-formula\nprop("Status")\n```'
        }
      />,
    )

    const csharpBlock = screen.getByRole('region', {
      name: 'Scrollable C# code block',
    })
    const formulaBlock = screen.getByRole('region', {
      name: 'Scrollable Notion Formula code block',
    })

    expect(csharpBlock.querySelector('code')).toHaveClass('language-csharp')
    expect(csharpBlock.querySelector('code')).toHaveAttribute(
      'data-code-language',
      'c#',
    )
    expect(csharpBlock.querySelector('code')).toHaveTextContent(
      'var active = true;',
    )
    expect(formulaBlock.querySelector('code')).toHaveClass(
      'language-notion-formula',
    )
    expect(formulaBlock.querySelector('pre')).toHaveAttribute(
      'data-language',
      'notion formula',
    )
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument()
  })

  it('falls back to selection copy when async text copy is unavailable', async () => {
    const user = userEvent.setup()
    const originalClipboard = navigator.clipboard
    const execCommand = vi.fn().mockReturnValue(true)
    document.execCommand = execCommand
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: undefined,
    })

    render(
      <MarkdownDocument
        resetKey="copy-code-fallback"
        source={'```text\nfallback content\n```'}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Copy Plain Text code' }))

    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(
      screen.getByRole('button', { name: 'Plain Text code copied' }),
    ).toHaveTextContent('Copied')

    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: originalClipboard,
    })
  })

  it('provides deterministic keyboard controls for horizontal overflow', () => {
    render(
      <MarkdownDocument
        resetKey="keyboard-overflow"
        source={'| Wide value |\n| --- |\n| content |'}
      />,
    )
    const tableRegion = screen.getByRole('region', { name: 'Scrollable table' })
    const scrollTo = vi.fn()
    Object.defineProperties(tableRegion, {
      clientWidth: { configurable: true, value: 300 },
      scrollLeft: { configurable: true, value: 0, writable: true },
      scrollTo: { configurable: true, value: scrollTo },
      scrollWidth: { configurable: true, value: 900 },
    })

    tableRegion.focus()
    fireEvent.keyDown(tableRegion, { key: 'ArrowRight' })
    expect(scrollTo).toHaveBeenCalledWith({ behavior: 'smooth', left: 48 })

    fireEvent.keyDown(tableRegion, { key: 'End' })
    expect(scrollTo).toHaveBeenLastCalledWith({ behavior: 'smooth', left: 600 })
  })

  it('shows a recoverable localized error and resets for a new document', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    function BrokenDocument() {
      throw new Error('Render failure')
    }

    const { rerender } = render(
      <MarkdownErrorBoundary resetKey="broken">
        <BrokenDocument />
      </MarkdownErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Preview unavailable')

    rerender(
      <MarkdownErrorBoundary resetKey="fixed">
        <p>Recovered document</p>
      </MarkdownErrorBoundary>,
    )

    expect(screen.getByText('Recovered document')).toBeVisible()
    consoleError.mockRestore()
  })
})
