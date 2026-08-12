import { Check, Copy, FileText, Info } from 'lucide-react'

import { Button } from '../../components/button/button.jsx'
import { FilePicker } from './file-picker.jsx'

export function DocumentToolbar({
  documentName,
  documentNameRef,
  isCopied,
  isCopying,
  isReplacing,
  onCopy,
  onFileChange,
  onOpenDetails,
}) {
  return (
    <header className="document-toolbar">
      <div className="document-toolbar__filename">
        <FileText aria-hidden="true" size={18} strokeWidth={1.8} />
        <h1
          ref={documentNameRef}
          id="document-name"
          className="truncate font-semibold"
          tabIndex="-1"
        >
          {documentName}
        </h1>
      </div>
      <div className="document-toolbar__actions">
        <Button
          aria-label="Open file details"
          className="document-toolbar__details"
          icon={Info}
          onClick={onOpenDetails}
          size="compact"
          type="button"
          variant="secondary"
        />
        <FilePicker
          disabled={isReplacing}
          onChange={onFileChange}
          size="compact"
        >
          {isReplacing ? 'Replacing…' : 'Replace'}
        </FilePicker>
        <Button
          aria-label="Copy document"
          disabled={isReplacing}
          icon={isCopied ? Check : Copy}
          isLoading={isCopying}
          onClick={onCopy}
          size="compact"
          type="button"
          variant="primary"
        >
          <span className="copy-label copy-label--long">Copy document</span>
          <span className="copy-label copy-label--short">Copy</span>
        </Button>
      </div>
    </header>
  )
}
