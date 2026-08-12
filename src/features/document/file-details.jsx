function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium text-ink-muted">{label}</dt>
      <dd className="mt-1 break-words text-sm text-ink">{value}</dd>
    </div>
  )
}

export function FileDetails({ isBusy, metadata, onStartOver }) {
  return (
    <aside className="file-details" aria-labelledby="file-details-title">
      <div>
        <h2 id="file-details-title" className="text-sm font-semibold">
          File details
        </h2>
        <dl className="mt-6 space-y-5">
          <Detail label="Name" value={metadata.name} />
          <Detail label="Type" value={metadata.type} />
          <Detail label="Size" value={metadata.formattedSize} />
          <Detail label="Words" value={metadata.wordCount.toLocaleString()} />
        </dl>
        <p className="mt-8 text-xs leading-5 text-ink-muted">
          Processed locally. Your file never leaves this browser.
        </p>
      </div>

      <button
        className="button button--secondary w-full"
        disabled={isBusy}
        onClick={onStartOver}
        type="button"
      >
        Start over
      </button>
    </aside>
  )
}
