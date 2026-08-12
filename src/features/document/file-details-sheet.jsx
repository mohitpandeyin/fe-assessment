import { Dialog } from '../../components/dialog/dialog.jsx'
import { FileDetailsContent } from './file-details.jsx'

export function FileDetailsSheet({
  isBusy,
  metadata,
  onClose,
  onStartOver,
  open,
}) {
  function handleStartOver() {
    onClose()
    onStartOver()
  }

  return (
    <Dialog onClose={onClose} open={open} title="File details">
      <FileDetailsContent
        isBusy={isBusy}
        metadata={metadata}
        onStartOver={handleStartOver}
      />
    </Dialog>
  )
}
