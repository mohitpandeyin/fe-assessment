import { getUrlPolicy } from './url-policy.js'

export function SafeLink({ children, href, node, ...props }) {
  void node
  const policy = getUrlPolicy(href)

  if (policy.kind === 'external') {
    return (
      <a
        {...props}
        href={policy.url}
        rel="noopener noreferrer"
        target="_blank"
      >
        {children}
      </a>
    )
  }

  if (policy.kind === 'anchor' || policy.kind === 'direct') {
    return (
      <a {...props} href={policy.url}>
        {children}
      </a>
    )
  }

  return (
    <span
      className="markdown-link-unavailable"
      title={
        policy.kind === 'relative'
          ? 'Local links are unavailable when one file is opened.'
          : 'This link uses an unsupported or unsafe address.'
      }
    >
      {children}
    </span>
  )
}

export function ImageFallback({ alt, node, src, title, ...props }) {
  void node
  const policy = getUrlPolicy(src)
  const label = alt?.trim() || 'Untitled image'
  const canLinkToSource = policy.kind === 'external'

  return (
    <span {...props} className="markdown-image-fallback" title={title}>
      <span>
        <strong>Image not loaded:</strong> {label}
      </span>
      {canLinkToSource ? (
        <a
          href={policy.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          View image source
        </a>
      ) : (
        <span className="markdown-image-reason">
          {policy.kind === 'relative'
            ? 'Local assets are unavailable.'
            : 'The image address is unavailable.'}
        </span>
      )}
    </span>
  )
}

export function ScrollableTable({ node, ...props }) {
  void node
  return (
    <div
      aria-label="Scrollable table"
      className="table-scroll"
      role="region"
      tabIndex="0"
    >
      <table {...props} />
    </div>
  )
}

export function ScrollableCodeBlock({ node, ...props }) {
  void node
  return (
    <div
      aria-label="Scrollable code block"
      className="code-scroll"
      role="region"
      tabIndex="0"
    >
      <pre {...props} />
    </div>
  )
}

export function ReadOnlyTask({ checked, node, type, ...props }) {
  void node
  if (type !== 'checkbox') {
    return <input {...props} type={type} />
  }

  return (
    <input
      {...props}
      aria-label={checked ? 'Completed task' : 'Incomplete task'}
      checked={Boolean(checked)}
      disabled
      readOnly
      type="checkbox"
    />
  )
}
