import { RotateCcw, ShieldCheck } from 'lucide-react'

import { Button } from '../../components/button/button.jsx'

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium text-ink-muted">{label}</dt>
      <dd className="mt-1 break-words text-sm text-ink">{value}</dd>
    </div>
  )
}

export function FileDetailsContent({ isBusy, metadata, onStartOver }) {
  return (
    <div className="file-details__content">
      <dl className="space-y-5">
        <Detail label="Name" value={metadata.name} />
        <Detail label="Type" value={metadata.type} />
        <Detail label="Size" value={metadata.formattedSize} />
        <Detail label="Words" value={metadata.wordCount.toLocaleString()} />
      </dl>
      <p className="file-details__assurance">
        <ShieldCheck aria-hidden="true" size={16} strokeWidth={1.8} />
        <span>Processed locally. Your file never leaves this browser.</span>
      </p>

      <Button
        className="w-full"
        disabled={isBusy}
        icon={RotateCcw}
        onClick={onStartOver}
        type="button"
        variant="secondary"
      >
        Start over
      </Button>
    </div>
  )
}

export function FileDetails({ isBusy, metadata, onStartOver }) {
  return (
    <aside className="file-details" aria-labelledby="file-details-title">
      <h2 id="file-details-title" className="text-sm font-semibold">
        File details
      </h2>
      <FileDetailsContent
        isBusy={isBusy}
        metadata={metadata}
        onStartOver={onStartOver}
      />
    </aside>
  )
}
