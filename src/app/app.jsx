import { useEffect, useReducer, useRef } from 'react'

import {
  documentReducer,
  initialDocumentState,
} from '../features/document/document-reducer.js'
import { DocumentWorkspace } from '../features/document/document-workspace.jsx'
import { UploadPanel } from '../features/document/upload-panel.jsx'
import { loadMarkdownDocument } from '../lib/files/load-markdown-document.js'
import './app.css'

export function App() {
  const [state, dispatch] = useReducer(documentReducer, initialDocumentState)
  const chooseInputRef = useRef(null)
  const intakePendingRef = useRef(false)
  const restoreChooseFocusRef = useRef(false)

  useEffect(() => {
    if (state.status === 'empty' && restoreChooseFocusRef.current) {
      restoreChooseFocusRef.current = false
      chooseInputRef.current?.focus()
    }
  }, [state.status])

  async function handleFiles(files) {
    if (intakePendingRef.current || !files || files.length === 0) {
      return
    }

    intakePendingRef.current = true
    dispatch({ type: 'read-started' })

    try {
      const document = await loadMarkdownDocument(files)
      dispatch({ type: 'read-succeeded', document })
    } catch (error) {
      dispatch({
        type: 'read-failed',
        message:
          error instanceof Error && error.message
            ? error.message
            : 'The file could not be opened.',
      })
    } finally {
      intakePendingRef.current = false
    }
  }

  function handleFileChange(event) {
    handleFiles(event.target.files)
    event.target.value = ''
  }

  function handleStartOver() {
    restoreChooseFocusRef.current = true
    dispatch({ type: 'cleared' })
  }

  return (
    <div className="app-shell">
      <header className="global-header">
        <div className="flex items-center gap-3">
          <span className="brand-mark" aria-hidden="true">
            P
          </span>
          <span className="font-semibold">Plainmark</span>
        </div>
        <span className="text-xs text-ink-on-dark">
          {state.activeDocument ? 'Local file' : 'Processed locally'}
        </span>
      </header>

      {state.activeDocument ? (
        <DocumentWorkspace
          document={state.activeDocument}
          error={state.error}
          isReplacing={state.status === 'replacing'}
          onDismissError={() => dispatch({ type: 'error-dismissed' })}
          onFileChange={handleFileChange}
          onStartOver={handleStartOver}
        />
      ) : (
        <UploadPanel
          chooseInputRef={chooseInputRef}
          error={state.error}
          isReading={state.status === 'reading'}
          onDismissError={() => dispatch({ type: 'error-dismissed' })}
          onFileChange={handleFileChange}
          onFiles={handleFiles}
        />
      )}
    </div>
  )
}
