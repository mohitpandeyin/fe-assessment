import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'

import { Button } from '../button/button.jsx'

export function Dialog({ children, onClose, open, title }) {
  const dialogRef = useRef(null)
  const returnFocusRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) {
      return
    }

    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  function handleDialogClose() {
    if (returnFocusRef.current?.isConnected) {
      returnFocusRef.current.focus()
    }

    onClose()
  }

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  function handleCancel(event) {
    event.preventDefault()
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="dialog-sheet"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      onClose={handleDialogClose}
    >
      {open ? (
        <div className="dialog-sheet__panel">
          <header className="dialog-sheet__header">
            <h2 id={titleId} className="font-semibold">
              {title}
            </h2>
            <Button
              aria-label="Close file details"
              icon={X}
              onClick={onClose}
              size="compact"
              type="button"
              variant="quiet"
            />
          </header>
          <div className="dialog-sheet__content">{children}</div>
        </div>
      ) : null}
    </dialog>
  )
}
