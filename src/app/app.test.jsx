import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import * as clipboardService from '../lib/clipboard/write-document-clipboard.js'
import { App } from './app.jsx'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('App', () => {
  it('opens a valid Markdown file and shows real metadata', async () => {
    const user = userEvent.setup()
    render(<App />)
    const file = new File(['# Hello world\n\nA local document.'], 'notes.md', {
      type: 'text/markdown',
    })

    await user.upload(screen.getByLabelText('Choose file'), file)

    expect(
      await screen.findByRole('heading', { name: 'Hello world', level: 1 }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'notes.md' }),
    ).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('keeps the active document when replacement validation fails', async () => {
    const user = userEvent.setup({ applyAccept: false })
    render(<App />)
    const input = screen.getByLabelText('Choose file')

    await user.upload(input, new File(['# First'], 'first.md'))
    await screen.findByRole('heading', { name: 'first.md' })
    await user.upload(
      screen.getByLabelText('Replace'),
      new File(['not markdown'], 'second.txt'),
    )

    expect(await screen.findByText('File not replaced')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'first.md' })).toBeInTheDocument()
  })

  it('clears the active document and restores focus on Start over', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.upload(
      screen.getByLabelText('Choose file'),
      new File(['# First'], 'first.md'),
    )
    await user.click(await screen.findByRole('button', { name: 'Start over' }))

    const chooseInput = await screen.findByLabelText('Choose file')
    expect(chooseInput).toHaveFocus()
  })

  it('loads a dropped file and rejects a multiple-file drop', async () => {
    render(<App />)
    const dropZone = screen.getByText('Open Markdown').parentElement

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [new File(['# Dropped'], 'dropped.md')],
      },
    })

    expect(
      await screen.findByRole('heading', { name: 'dropped.md' }),
    ).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Start over' }))
    const emptyDropZone = screen.getByText('Open Markdown').parentElement

    fireEvent.drop(emptyDropZone, {
      dataTransfer: {
        files: [new File(['a'], 'a.md'), new File(['b'], 'b.md')],
      },
    })

    expect(await screen.findByText('File not opened')).toBeInTheDocument()
    expect(screen.getByText('Choose one Markdown file at a time.')).toBeVisible()
  })

  it('accepts an empty document and successfully replaces a document', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByLabelText('Choose file')

    await user.upload(input, new File([], 'empty.md'))
    expect(
      await screen.findByRole('heading', {
        name: 'This Markdown file is empty',
      }),
    ).toBeVisible()

    await user.upload(
      screen.getByLabelText('Replace'),
      new File(['# Replacement'], 'replacement.md'),
    )
    expect(
      await screen.findByRole('heading', { name: 'replacement.md' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'replacement.md' })).toHaveFocus()
    expect(
      screen.queryByRole('heading', { name: 'This Markdown file is empty' }),
    ).not.toBeInTheDocument()
  })

  it('leaves the empty state unchanged when file selection is cancelled', () => {
    render(<App />)
    const input = screen.getByLabelText('Choose file')

    fireEvent.change(input, { target: { files: [] } })

    expect(screen.getByLabelText('Choose file')).toBeEnabled()
    expect(screen.queryByText('File not opened')).not.toBeInTheDocument()
  })

  it('ignores a second intake action while the current file is being read', async () => {
    let finishReading
    const source = new Promise((resolve) => {
      finishReading = resolve
    })
    const slowFile = {
      name: 'slow.md',
      size: 10,
      text: () => source,
    }
    const ignoredFile = {
      name: 'ignored.md',
      size: 10,
      text: () => Promise.resolve('# Ignored'),
    }

    render(<App />)
    const dropZone = screen.getByText('Open Markdown').parentElement

    fireEvent.drop(dropZone, { dataTransfer: { files: [slowFile] } })
    fireEvent.drop(dropZone, { dataTransfer: { files: [ignoredFile] } })

    expect(screen.getByLabelText('Preparing…')).toBeDisabled()

    await act(async () => finishReading('# Slow'))

    expect(
      await screen.findByRole('heading', { name: 'slow.md' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'ignored.md' })).not.toBeInTheDocument()
  })

  it('opens mobile file details and restores focus when the sheet closes', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.upload(
      screen.getByLabelText('Choose file'),
      new File(['# Details'], 'details.md'),
    )

    const trigger = await screen.findByRole('button', {
      name: 'Open file details',
    })
    await user.click(trigger)

    const dialog = screen.getByRole('dialog', { name: 'File details' })
    expect(dialog).toHaveAttribute('open')
    expect(dialog).toHaveTextContent('details.md')

    await user.click(
      screen.getByRole('button', { name: 'Close file details' }),
    )
    expect(trigger).toHaveFocus()
  })

  it('copies the complete document and announces rich-copy success', async () => {
    const user = userEvent.setup()
    vi.spyOn(clipboardService, 'writeDocumentClipboard').mockResolvedValue({
      formats: ['text/html', 'text/plain'],
      kind: 'rich',
    })
    render(<App />)

    await user.upload(
      screen.getByLabelText('Choose file'),
      new File(['# Copy me'], 'copy.md'),
    )
    await user.click(
      await screen.findByRole('button', { name: 'Copy document' }),
    )

    expect(await screen.findByText('Document copied')).toBeVisible()
    expect(clipboardService.writeDocumentClipboard).toHaveBeenCalledWith({
      markdown: '# Copy me',
      root: screen.getByRole('article', {
        name: 'Rendered Markdown document',
      }),
    })
  })

  it('announces plain-text fallback and clipboard failure outcomes', async () => {
    const user = userEvent.setup()
    const copyDocument = vi
      .spyOn(clipboardService, 'writeDocumentClipboard')
      .mockResolvedValueOnce({ formats: ['text/plain'], kind: 'plain' })
      .mockRejectedValueOnce(new Error('Clipboard permission was denied.'))
    render(<App />)

    await user.upload(
      screen.getByLabelText('Choose file'),
      new File(['# Copy states'], 'states.md'),
    )
    const copyButton = await screen.findByRole('button', {
      name: 'Copy document',
    })

    await user.click(copyButton)
    expect(await screen.findByText('Copied as plain text')).toBeVisible()

    await user.click(copyButton)
    expect(await screen.findByText('Copy failed')).toBeVisible()
    expect(screen.getByText('Clipboard permission was denied.')).toBeVisible()
    expect(copyDocument).toHaveBeenCalledTimes(2)
  })
})
