import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { App } from './app.jsx'

describe('App', () => {
  it('opens a valid Markdown file and shows real metadata', async () => {
    const user = userEvent.setup()
    render(<App />)
    const file = new File(['# Hello world\n\nA local document.'], 'notes.md', {
      type: 'text/markdown',
    })

    await user.upload(screen.getByLabelText('Choose file'), file)

    expect(
      await screen.findByRole('heading', { name: 'Document loaded successfully' }),
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
    expect(await screen.findByText('This Markdown file is empty.')).toBeVisible()

    await user.upload(
      screen.getByLabelText('Replace'),
      new File(['# Replacement'], 'replacement.md'),
    )
    expect(
      await screen.findByRole('heading', { name: 'replacement.md' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('This Markdown file is empty.')).not.toBeInTheDocument()
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

    expect(screen.getByLabelText('Reading file…')).toBeDisabled()

    await act(async () => finishReading('# Slow'))

    expect(
      await screen.findByRole('heading', { name: 'slow.md' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'ignored.md' })).not.toBeInTheDocument()
  })
})
