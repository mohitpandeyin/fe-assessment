import { useState } from 'react'
import { AppWindow, Copy, FileDown, ShieldCheck, Upload } from 'lucide-react'

import { InlineAlert } from '../../components/inline-alert/inline-alert.jsx'
import { FilePicker } from './file-picker.jsx'

const benefits = [
  { icon: ShieldCheck, label: 'Stays on your device' },
  { icon: AppWindow, label: 'Rendered in your browser' },
  { icon: Copy, label: 'Rich-text copy' },
]

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
      <section className="upload-content mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Open, preview, and copy Markdown
        </h1>
        <p className="mx-auto mt-4 max-w-xl leading-7 text-ink-secondary">
          Render complex Markdown beautifully—without uploading your file.
        </p>

        <div
          aria-busy={isReading || undefined}
          className="upload-panel mt-8"
          data-dragging={isDragging || undefined}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <span className="upload-panel__icon" aria-hidden="true">
            <FileDown size={48} strokeWidth={1.6} />
          </span>
          <p aria-live="polite" className="upload-panel__title font-semibold">
            {isReading
              ? 'Preparing preview…'
              : isDragging
                ? 'Drop to preview'
                : 'Open Markdown'}
          </p>
          <p className="upload-panel__description mt-2 text-ink-secondary">
            Drag and drop one .md file here, or choose it from your computer.{' '}
            <a
              className="text-inherit underline underline-offset-2"
              download="sample-file.md"
              href="/sample-file.md"
            >
              Sample File.
            </a>
          </p>
          <FilePicker
            disabled={isReading}
            icon={Upload}
            inputRef={chooseInputRef}
            onChange={onFileChange}
            variant="primary"
          >
            {isReading ? 'Preparing…' : 'Choose file'}
          </FilePicker>
          <p className="mt-4 text-xs text-ink-muted">
            Supports .md and .markdown files up to 1 MB.
          </p>
        </div>

        {error ? (
          <div className="mt-5 text-left">
            <InlineAlert
              description={error}
              onDismiss={onDismissError}
              title="File not opened"
            />
          </div>
        ) : null}

        <ul className="upload-benefits" aria-label="Plainmark benefits">
          {benefits.map(({ icon: BenefitIcon, label }) => (
            <li key={label}>
              <BenefitIcon aria-hidden="true" size={17} strokeWidth={1.8} />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-sm text-ink-muted">No account required.</p>
      </section>
    </main>
  )
}
