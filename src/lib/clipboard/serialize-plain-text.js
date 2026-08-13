import { getUrlPolicy } from '../../features/markdown/url-policy.js'

function serializeInline(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    let value = node.nodeValue ?? ''

    // react-markdown may retain the source newline in the text node after a
    // hard-break <br>. The break already supplies the newline, so converting
    // that formatting newline to a space produces `>  text` in blockquotes.
    // Remove only that synthetic leading newline; preserve real spaces used by
    // nested lists and code indentation.
    if (node.previousSibling?.nodeName === 'BR') {
      value = value.replace(/^[\t\r\n]+/, '')
    }

    return value.replace(/[\t\r\n]+/g, ' ')
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return ''
  }

  const tagName = node.tagName.toLowerCase()

  if (tagName === 'br') {
    return '\n'
  }

  if (tagName === 'input' && node.type === 'checkbox') {
    return node.checked ? '[x]' : '[ ]'
  }

  if (node.classList.contains('markdown-image-fallback')) {
    return Array.from(node.childNodes)
      .map(serializeInline)
      .map((value) => value.trim())
      .filter(Boolean)
      .join(' — ')
  }

  if (tagName === 'a') {
    const label = Array.from(node.childNodes).map(serializeInline).join('').trim()
    const policy = getUrlPolicy(node.getAttribute('href'))

    if (!['direct', 'external'].includes(policy.kind)) {
      return label
    }

    return label && label !== policy.url ? `${label} (${policy.url})` : policy.url
  }

  return Array.from(node.childNodes).map(serializeInline).join('')
}

function serializeList(list, depth = 0) {
  const items = Array.from(list.children).filter(
    (child) => child.tagName.toLowerCase() === 'li',
  )
  const ordered = list.tagName.toLowerCase() === 'ol'
  const start = Number(list.getAttribute('start')) || 1

  return items
    .map((item, index) => {
      const nestedLists = Array.from(item.children).filter((child) =>
        ['ol', 'ul'].includes(child.tagName.toLowerCase()),
      )
      const contentNodes = Array.from(item.childNodes).filter(
        (child) => !nestedLists.includes(child),
      )
      const content = contentNodes
        .map((child) =>
          child.nodeType === Node.ELEMENT_NODE &&
          child.tagName.toLowerCase() === 'p'
            ? Array.from(child.childNodes).map(serializeInline).join('')
            : serializeInline(child),
        )
        .join('')
        .trim()
      const indent = '  '.repeat(depth)
      const marker = ordered ? `${start + index}.` : '-'
      const lines = content.split('\n')
      const firstLine = `${indent}${marker} ${lines.shift() ?? ''}`.trimEnd()
      const continuation = lines
        .map((line) => `${indent}  ${line}`.trimEnd())
        .join('\n')
      const nested = nestedLists
        .map((nestedList) => serializeList(nestedList, depth + 1))
        .filter(Boolean)
        .join('\n')

      return [firstLine, continuation, nested].filter(Boolean).join('\n')
    })
    .join('\n')
}

function serializeTable(table) {
  return Array.from(table.querySelectorAll('tr'))
    .map((row) =>
      Array.from(row.children)
        .filter((cell) => ['td', 'th'].includes(cell.tagName.toLowerCase()))
        .map((cell) => serializeInline(cell).trim())
        .join('\t'),
    )
    .join('\n')
}

function serializeBlock(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.nodeValue?.trim() ?? ''
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return ''
  }

  const tagName = node.tagName.toLowerCase()

  if (/^h[1-6]$/.test(tagName) || tagName === 'p') {
    return serializeInline(node).trim()
  }

  if (tagName === 'ol' || tagName === 'ul') {
    return serializeList(node)
  }

  if (tagName === 'blockquote') {
    return serializeBlocks(node)
      .split('\n')
      .map((line) => (line ? `> ${line}` : '>'))
      .join('\n')
  }

  if (tagName === 'pre') {
    return node.textContent?.replace(/\n$/, '') ?? ''
  }

  if (node.classList.contains('code-block__toolbar')) {
    return ''
  }

  if (tagName === 'table') {
    return serializeTable(node)
  }

  if (tagName === 'hr') {
    return '---'
  }

  if (tagName === 'div' || tagName === 'article') {
    return serializeBlocks(node)
  }

  return serializeInline(node).trim()
}

function serializeBlocks(root) {
  return Array.from(root.childNodes)
    .map(serializeBlock)
    .filter(Boolean)
    .join('\n\n')
}

export function serializePlainText(root) {
  if (!root) {
    throw new Error('Rendered document content is unavailable.')
  }

  return serializeBlocks(root).replace(/^\n+|\n+$/g, '')
}
