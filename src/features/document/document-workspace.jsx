import { FileDetails } from './file-details.jsx'
import { FilePicker } from './file-picker.jsx'
import { MarkdownDocument } from '../markdown/markdown-document.jsx'

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

        <div className="document-surface mx-auto max-w-4xl px-5 py-10 sm:px-10">
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

          <MarkdownDocument
            resetKey={document.file}
            source={document.source}
          />
        </div>
      </section>
    </main>
  )
}
