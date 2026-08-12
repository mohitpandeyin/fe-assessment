import { getUrlPolicy } from '../../features/markdown/url-policy.js'
import {
  DOCUMENT_EXPORT_STYLE,
  PORTABLE_ELEMENT_STYLES,
  PORTABLE_IMAGE_FALLBACK_STYLE,
  PORTABLE_INLINE_CODE_STYLE,
} from './export-styles.js'

const UNSAFE_ELEMENTS = new Set([
  'audio',
  'button',
  'canvas',
  'embed',
  'form',
  'iframe',
  'object',
  'script',
  'select',
  'style',
  'textarea',
  'video',
])

function unwrap(element) {
  element.replaceWith(...element.childNodes)
}

function replaceTaskCheckboxes(root) {
  for (const input of root.querySelectorAll('input[type="checkbox"]')) {
    const marker = root.ownerDocument.createTextNode(
      input.checked ? '[x]' : '[ ]',
    )
    input.replaceWith(marker)
  }
}

function normalizePreviewWrappers(root) {
  for (const wrapper of root.querySelectorAll('.table-scroll, .code-scroll')) {
    unwrap(wrapper)
  }

  for (const wrapper of root.querySelectorAll('div')) {
    unwrap(wrapper)
  }
}

function sanitizeLink(element) {
  const policy = getUrlPolicy(element.getAttribute('href'))

  if (!['anchor', 'direct', 'external'].includes(policy.kind)) {
    unwrap(element)
    return false
  }

  element.setAttribute('href', policy.url)
  element.removeAttribute('rel')
  element.removeAttribute('target')
  return true
}

function applyPortableStyle(element) {
  const tagName = element.tagName.toLowerCase()
  let style = PORTABLE_ELEMENT_STYLES[tagName] ?? ''

  if (tagName === 'code' && element.parentElement?.tagName !== 'PRE') {
    style = PORTABLE_INLINE_CODE_STYLE
  }

  if (element.classList.contains('markdown-image-fallback')) {
    style = PORTABLE_IMAGE_FALLBACK_STYLE
  }

  if (['td', 'th'].includes(tagName)) {
    const alignment = element.style.textAlign
    style += alignment ? `text-align:${alignment};` : ''
  }

  if (style) {
    element.setAttribute('style', style)
  } else {
    element.removeAttribute('style')
  }
}

function sanitizeElement(element) {
  const tagName = element.tagName.toLowerCase()

  if (UNSAFE_ELEMENTS.has(tagName)) {
    element.remove()
    return
  }

  if (tagName === 'a' && !sanitizeLink(element)) {
    return
  }

  applyPortableStyle(element)

  for (const attribute of Array.from(element.attributes)) {
    const name = attribute.name.toLowerCase()
    const keep = name === 'href' || name === 'style'

    if (!keep || name.startsWith('on')) {
      element.removeAttribute(attribute.name)
    }
  }
}

export function serializePortableHtml(root) {
  if (!root) {
    throw new Error('Rendered document content is unavailable.')
  }

  const clone = root.cloneNode(true)
  replaceTaskCheckboxes(clone)
  normalizePreviewWrappers(clone)

  for (const element of Array.from(clone.querySelectorAll('*'))) {
    sanitizeElement(element)
  }

  return `<div style="${DOCUMENT_EXPORT_STYLE}">${clone.innerHTML}</div>`
}
