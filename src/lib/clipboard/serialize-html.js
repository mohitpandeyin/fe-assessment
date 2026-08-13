import { getUrlPolicy } from '../../features/markdown/url-policy.js'
import {
  DOCUMENT_EXPORT_STYLE,
  PORTABLE_CODE_CELL_STYLE,
  PORTABLE_CODE_CONTENT_STYLE,
  PORTABLE_CODE_TABLE_STYLE,
  PORTABLE_ELEMENT_STYLES,
  PORTABLE_IMAGE_FALLBACK_STYLE,
  PORTABLE_INLINE_CODE_STYLE,
} from './export-styles.js'
import {
  getCodeLanguageFromClassName,
  getNotionCodeLanguageClassToken,
  normalizeNotionCodeLanguage,
} from '../../features/markdown/code-languages.js'

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
  for (const toolbar of root.querySelectorAll('.code-block__toolbar')) {
    toolbar.remove()
  }

  for (const wrapper of root.querySelectorAll('.table-scroll, .code-scroll')) {
    unwrap(wrapper)
  }

  for (const wrapper of root.querySelectorAll('div')) {
    if (!wrapper.classList.contains('code-block')) {
      unwrap(wrapper)
    }
  }
}

function normalizeCodeBlocks(root) {
  for (const pre of root.querySelectorAll('pre')) {
    const code = pre.querySelector(':scope > code')

    if (!code) {
      continue
    }

    const language = normalizeNotionCodeLanguage(
      code.getAttribute('data-code-language') ||
        code.getAttribute('data-language') ||
        pre.getAttribute('data-code-language') ||
        pre.getAttribute('data-language') ||
        getCodeLanguageFromClassName(code.className),
    )
    const className = `language-${getNotionCodeLanguageClassToken(language)}`

    for (const element of [pre, code]) {
      element.setAttribute('data-code-language', language)
      element.setAttribute('data-language', language)
    }
    code.className = className

    // Keep the real newlines in one inline run: Google Docs adds paragraph gaps for
    // per-line blocks, while CSS-only breaks flatten in Word and Notion without `\n`.
    const codeContent = root.ownerDocument.createElement('span')
    codeContent.className = 'portable-code-content'
    codeContent.textContent = code.textContent.replace(/\n$/, '')
    code.replaceChildren(codeContent)

    const wrapper = pre.closest('.code-block')

    if (wrapper) {
      // The cell owns one continuous background so rich editors do not shade each line.
      const table = root.ownerDocument.createElement('table')
      const tableBody = root.ownerDocument.createElement('tbody')
      const tableRow = root.ownerDocument.createElement('tr')
      const tableCell = root.ownerDocument.createElement('td')

      table.className = 'portable-code-table'
      tableCell.className = 'portable-code-cell'
      tableCell.append(pre)
      tableRow.append(tableCell)
      tableBody.append(tableRow)
      table.append(tableBody)
      wrapper.replaceWith(table)
    }
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

  if (element.classList.contains('portable-code-table')) {
    style = PORTABLE_CODE_TABLE_STYLE
  }

  if (element.classList.contains('portable-code-cell')) {
    style = PORTABLE_CODE_CELL_STYLE
  }

  if (element.classList.contains('portable-code-content')) {
    style = PORTABLE_CODE_CONTENT_STYLE
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
    const isCodeMetadata =
      ['code', 'pre'].includes(tagName) &&
      ['data-code-language', 'data-language'].includes(name)
    const isCodeClass =
      tagName === 'code' &&
      name === 'class' &&
      /^language-[^\s]+$/.test(attribute.value)
    const keep =
      name === 'href' || name === 'style' || isCodeMetadata || isCodeClass

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
  normalizeCodeBlocks(clone)

  for (const element of Array.from(clone.querySelectorAll('*'))) {
    sanitizeElement(element)
  }

  return `<div style="${DOCUMENT_EXPORT_STYLE}">${clone.innerHTML}</div>`
}
