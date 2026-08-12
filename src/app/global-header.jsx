export function GlobalHeader({ hasDocument }) {
  return (
    <header className="global-header">
      <div className="global-header__brand">
        <span className="brand-mark" aria-hidden="true">
          P
        </span>
        <span className="font-semibold">Plainmark</span>
      </div>
      <div className="local-status">
        {hasDocument ? (
          <span className="local-status__dot" aria-hidden="true" />
        ) : null}
        <span>{hasDocument ? 'Local file' : 'Processed locally'}</span>
      </div>
    </header>
  )
}
