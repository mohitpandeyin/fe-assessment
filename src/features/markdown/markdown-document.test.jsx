import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import openTestCase from '../../../requirements/open_test_case.md?raw'
import malformedElements from '../../test/fixtures/malformed-elements.md?raw'
import requiredElements from '../../test/fixtures/required-elements.md?raw'
import { MarkdownDocument } from './markdown-document.jsx'
import { MarkdownErrorBoundary } from './markdown-error-boundary.jsx'

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
      name: 'Scrollable code block',
    })
    expect(codeRegions).toHaveLength(3)
    expect(codeRegions[0]).toHaveAttribute('tabindex', '0')
    expect(codeRegions[0].querySelector('pre > code').textContent).toContain(
      'preserve    spacing',
    )
    expect(codeRegions[1].querySelector('code')).toHaveClass(
      'language-unknown-language',
    )
    expect(codeRegions[2].querySelector('code')).not.toHaveAttribute('class')

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
    expect(screen.getAllByRole('region', { name: 'Scrollable code block' })).toHaveLength(
      4,
    )
    expect(screen.queryByText('Preview unavailable')).not.toBeInTheDocument()
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
