import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'

import { getUrlPolicy } from './url-policy.js'

const LANGUAGE_LABELS = {
  bash: 'Shell',
  csharp: 'C#',
  css: 'CSS',
  html: 'HTML',
  javascript: 'JavaScript',
  js: 'JavaScript',
  json: 'JSON',
  jsx: 'JSX',
  lua: 'Lua',
  markdown: 'Markdown',
  md: 'Markdown',
  plaintext: 'Plain text',
  python: 'Python',
  shell: 'Shell',
  sql: 'SQL',
  text: 'Plain text',
  ts: 'TypeScript',
  tsx: 'TSX',
  typescript: 'TypeScript',
  xml: 'XML',
  yaml: 'YAML',
  yml: 'YAML',
}

function getCodeLanguage(children) {
  const code = Array.isArray(children) ? children[0] : children
  const className = code?.props?.className ?? ''
  const match = String(className).match(/(?:lang|language)-([^\s]+)/)
  return match?.[1]?.toLowerCase() ?? ''
}

function getLanguageLabel(language) {
  if (!language) {
    return 'Code'
  }

  return LANGUAGE_LABELS[language] ?? language.replace(/[-_]+/g, ' ')
}

function getReactText(value) {
  if (Array.isArray(value)) {
    return value.map(getReactText).join('')
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value)
  }

  if (value?.props) {
    return getReactText(value.props.children)
  }

  return ''
}

function copyWithSelection(text) {
  const selection = window.getSelection()
  const previousRanges = selection
    ? Array.from({ length: selection.rangeCount }, (_, index) =>
        selection.getRangeAt(index).cloneRange(),
      )
    : []
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.append(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  textarea.remove()

  if (selection) {
    selection.removeAllRanges()
    previousRanges.forEach((range) => selection.addRange(range))
  }

  return copied
}

function handleOverflowKeyDown(event) {
  const region = event.currentTarget
  const maxScroll = region.scrollWidth - region.clientWidth

  if (maxScroll <= 0) {
    return
  }

  const scrollTargets = {
    ArrowLeft: Math.max(0, region.scrollLeft - 48),
    ArrowRight: Math.min(maxScroll, region.scrollLeft + 48),
    End: maxScroll,
    Home: 0,
  }
  const left = scrollTargets[event.key]

  if (left === undefined) {
    return
  }

  event.preventDefault()
  region.scrollTo({ behavior: 'smooth', left })
}

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
      onKeyDown={handleOverflowKeyDown}
      role="region"
      tabIndex="0"
    >
      <table {...props} />
    </div>
  )
}

export function ScrollableCodeBlock({ node, ...props }) {
  void node
  const [copyState, setCopyState] = useState('idle')
  const resetTimerRef = useRef(null)
  const language = getCodeLanguage(props.children)
  const label = getLanguageLabel(language)
  const code = Array.isArray(props.children) ? props.children[0] : props.children
  const codeText = getReactText(code?.props?.children).replace(/\n$/, '')

  useEffect(
    () => () => {
      window.clearTimeout(resetTimerRef.current)
    },
    [],
  )

  async function handleCopy() {
    if (copyState === 'copying') {
      return
    }

    setCopyState('copying')

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(codeText)
      } else if (!copyWithSelection(codeText)) {
        throw new Error('Clipboard access is unavailable.')
      }
      setCopyState('copied')
      window.clearTimeout(resetTimerRef.current)
      resetTimerRef.current = window.setTimeout(
        () => setCopyState('idle'),
        1800,
      )
    } catch {
      setCopyState('failed')
    }
  }

  const CopyIcon = copyState === 'copied' ? Check : Copy
  const copyLabel =
    copyState === 'copied'
      ? `${label} code copied`
      : copyState === 'failed'
        ? `Could not copy ${label} code. Try again`
        : `Copy ${label} code`

  return (
    <div className="code-block">
      <div className="code-block__toolbar">
        <span className="code-block__language">{label}</span>
        <button
          aria-label={copyLabel}
          className="code-block__copy"
          data-state={copyState}
          disabled={copyState === 'copying'}
          onClick={handleCopy}
          title={copyLabel}
          type="button"
        >
          <CopyIcon aria-hidden="true" size={15} strokeWidth={1.8} />
          <span>{copyState === 'copied' ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div
        aria-label={`Scrollable ${label} code block`}
        className="code-scroll"
        onKeyDown={handleOverflowKeyDown}
        role="region"
        tabIndex="0"
      >
        <pre {...props} />
      </div>
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
