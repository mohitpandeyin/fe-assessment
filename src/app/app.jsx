import { useEffect, useReducer, useRef } from 'react'

import { ToastProvider } from '../components/toast/toast-provider.jsx'
import {
  documentReducer,
  initialDocumentState,
} from '../features/document/document-reducer.js'
import { DocumentWorkspace } from '../features/document/document-workspace.jsx'
import { UploadPanel } from '../features/document/upload-panel.jsx'
import { loadMarkdownDocument } from '../lib/files/load-markdown-document.js'
import { GlobalHeader } from './global-header.jsx'
import './app.css'

function PlainmarkApp() {
  const [state, dispatch] = useReducer(documentReducer, initialDocumentState)
  const chooseInputRef = useRef(null)
  const documentNameRef = useRef(null)
  const intakePendingRef = useRef(false)
  const restoreDocumentFocusRef = useRef(false)
  const restoreChooseFocusRef = useRef(false)

  useEffect(() => {
    if (state.status === 'empty' && restoreChooseFocusRef.current) {
      restoreChooseFocusRef.current = false
      chooseInputRef.current?.focus()
    }
  }, [state.status])

  useEffect(() => {
    if (state.status === 'ready' && restoreDocumentFocusRef.current) {
      restoreDocumentFocusRef.current = false
      documentNameRef.current?.focus()
    }
  }, [state.status, state.activeDocument])

  async function handleFiles(files) {
    if (intakePendingRef.current || !files || files.length === 0) {
      return
    }

    intakePendingRef.current = true
    const isReplacement = Boolean(state.activeDocument)
    dispatch({ type: 'read-started' })

    try {
      const document = await loadMarkdownDocument(files)
      restoreDocumentFocusRef.current = isReplacement
      dispatch({ type: 'read-succeeded', document })
    } catch (error) {
      restoreDocumentFocusRef.current = false
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
      <GlobalHeader hasDocument={Boolean(state.activeDocument)} />

      {state.activeDocument ? (
        <DocumentWorkspace
          document={state.activeDocument}
          documentNameRef={documentNameRef}
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

export function App() {
  return (
    <ToastProvider>
      <PlainmarkApp />
    </ToastProvider>
  )
}
