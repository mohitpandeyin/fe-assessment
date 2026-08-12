import { useEffect, useRef, useState } from 'react'

import { InlineAlert } from '../../components/inline-alert/inline-alert.jsx'
import { useToast } from '../../components/toast/use-toast.js'
import { writeDocumentClipboard } from '../../lib/clipboard/write-document-clipboard.js'
import { MarkdownDocument } from '../markdown/markdown-document.jsx'
import { DocumentToolbar } from './document-toolbar.jsx'
import { FileDetails } from './file-details.jsx'
import { FileDetailsSheet } from './file-details-sheet.jsx'

export function DocumentWorkspace({
  document,
  documentNameRef,
  error,
  isReplacing,
  onDismissError,
  onFileChange,
  onStartOver,
}) {
  const [copyState, setCopyState] = useState('idle')
  const [detailsOpen, setDetailsOpen] = useState(false)
  const articleRef = useRef(null)
  const copiedTimerRef = useRef(null)
  const { showToast } = useToast()

  useEffect(
    () => () => {
      window.clearTimeout(copiedTimerRef.current)
    },
    [],
  )

  async function handleCopy() {
    if (copyState === 'copying') {
      return
    }

    setCopyState('copying')

    try {
      const result = await writeDocumentClipboard({
        markdown: document.source,
        root: articleRef.current,
      })

      if (result.kind === 'plain') {
        showToast({
          description: 'Rich clipboard formats were unavailable in this browser.',
          title: 'Copied as plain text',
          tone: 'info',
        })
      } else {
        showToast({ title: 'Document copied', tone: 'success' })
      }

      setCopyState('copied')
      window.clearTimeout(copiedTimerRef.current)
      copiedTimerRef.current = window.setTimeout(
        () => setCopyState('idle'),
        1800,
      )
    } catch (copyError) {
      setCopyState('idle')
      showToast({
        description:
          copyError instanceof Error
            ? copyError.message
            : 'Check clipboard permissions and try again.',
        title: 'Copy failed',
        tone: 'error',
      })
    }
  }

  return (
    <main className="document-layout text-ink">
      <FileDetails
        isBusy={isReplacing}
        metadata={document.metadata}
        onStartOver={onStartOver}
      />

      <section className="min-w-0 bg-workspace" aria-labelledby="document-name">
        <DocumentToolbar
          documentName={document.metadata.name}
          documentNameRef={documentNameRef}
          isCopied={copyState === 'copied'}
          isCopying={copyState === 'copying'}
          isReplacing={isReplacing}
          onCopy={handleCopy}
          onFileChange={onFileChange}
          onOpenDetails={() => setDetailsOpen(true)}
        />

        <div className="document-surface mx-auto max-w-4xl px-5 py-10 sm:px-10">
          {error ? (
            <div className="mb-6">
              <InlineAlert
                description={error}
                onDismiss={onDismissError}
                title="File not replaced"
              />
            </div>
          ) : null}

          <MarkdownDocument
            articleRef={articleRef}
            resetKey={document.file}
            source={document.source}
          />
        </div>
      </section>

      <FileDetailsSheet
        isBusy={isReplacing}
        metadata={document.metadata}
        onClose={() => setDetailsOpen(false)}
        onStartOver={onStartOver}
        open={detailsOpen}
      />
    </main>
  )
}
