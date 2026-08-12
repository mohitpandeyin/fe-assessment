import { FileDetails } from './file-details.jsx'
import { FilePicker } from './file-picker.jsx'

export function DocumentWorkspace({
  document,
  error,
  isReplacing,
  onDismissError,
  onFileChange,
  onStartOver,
}) {
  return (
    <main className="document-layout text-ink">
      <FileDetails
        isBusy={isReplacing}
        metadata={document.metadata}
        onStartOver={onStartOver}
      />

      <section className="min-w-0 bg-workspace" aria-labelledby="document-name">
        <header className="document-toolbar">
          <h1 id="document-name" className="min-w-0 truncate font-semibold">
            {document.metadata.name}
          </h1>
          <FilePicker
            disabled={isReplacing}
            onChange={onFileChange}
          >
            {isReplacing ? 'Replacing…' : 'Replace'}
          </FilePicker>
        </header>

        <div className="mx-auto max-w-3xl px-5 py-10 sm:px-10">
          {error ? (
            <div className="inline-alert mb-6" role="alert">
              <div>
                <p className="font-semibold">File not replaced</p>
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

          <section className="foundation-placeholder">
            <p className="text-sm font-semibold text-accent">File ready</p>
            <h2 className="mt-3 text-2xl font-semibold">
              Document loaded successfully
            </h2>
            <p className="mt-3 leading-7 text-ink-secondary">
              Markdown rendering begins in Phase 3. The source is already held
              locally and ready for the renderer.
            </p>
            {document.source.length === 0 ? (
              <p className="mt-5 text-sm text-ink-muted">
                This Markdown file is empty.
              </p>
            ) : null}
          </section>
        </div>
      </section>
    </main>
  )
}
