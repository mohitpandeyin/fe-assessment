import { useState } from 'react'

import { FilePicker } from './file-picker.jsx'

export function UploadPanel({
  chooseInputRef,
  error,
  isReading,
  onDismissError,
  onFileChange,
  onFiles,
}) {
  const [isDragging, setIsDragging] = useState(false)

  function handleDragEnter(event) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragging(false)
    }
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)
    onFiles(event.dataTransfer.files)
  }

  return (
    <main className="upload-page px-5 py-10 text-ink sm:px-8">
      <section className="mx-auto w-full max-w-3xl text-center">
        <p className="text-xs font-semibold tracking-widest text-ink-muted">
          MARKDOWN VIEWER
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Open, preview, and copy Markdown
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-ink-secondary">
          Choose one Markdown file. Plainmark reads it locally in your browser.
        </p>

        <div
          className="upload-panel mt-8"
          data-dragging={isDragging || undefined}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <p className="text-xl font-semibold">
            {isDragging ? 'Drop to preview' : 'Open Markdown'}
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-secondary">
            Drag and drop one .md file here, or choose it from your computer.
          </p>
          <FilePicker
            disabled={isReading}
            inputRef={chooseInputRef}
            onChange={onFileChange}
            variant="primary"
          >
            {isReading ? 'Reading file…' : 'Choose file'}
          </FilePicker>
          <p className="mt-4 text-xs text-ink-muted">
            Supports .md and .markdown files up to 5 MB
          </p>
        </div>

        {error ? (
          <div className="inline-alert mt-5 text-left" role="alert">
            <div>
              <p className="font-semibold">File not opened</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
            <button
              className="button button--quiet"
              onClick={onDismissError}
              type="button"
            >
              Dismiss
            </button>
          </div>
        ) : null}

        <p className="mt-6 text-sm text-ink-muted">
          Your file stays on this device. No uploads and no account required.
        </p>
      </section>
    </main>
  )
}
