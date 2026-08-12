import { serializePortableHtml } from './serialize-html.js'
import { serializePlainText } from './serialize-plain-text.js'

function createClipboardItem(ClipboardItemConstructor, BlobConstructor, data) {
  return new ClipboardItemConstructor(
    Object.fromEntries(
      Object.entries(data).map(([type, value]) => [
        type,
        new BlobConstructor([value], { type }),
      ]),
    ),
  )
}

function supportsMarkdown(ClipboardItemConstructor) {
  try {
    return (
      typeof ClipboardItemConstructor?.supports === 'function' &&
      ClipboardItemConstructor.supports('text/markdown')
    )
  } catch {
    return false
  }
}

export async function writeDocumentClipboard({
  BlobConstructor = globalThis.Blob,
  ClipboardItemConstructor = globalThis.ClipboardItem,
  clipboard = globalThis.navigator?.clipboard,
  markdown,
  root,
}) {
  const html = serializePortableHtml(root)
  const plainText = serializePlainText(root)

  if (!clipboard) {
    throw new Error(
      'Clipboard access is unavailable. Check your browser permissions and try again.',
    )
  }

  const canWriteRich =
    ClipboardItemConstructor &&
    BlobConstructor &&
    typeof clipboard.write === 'function'

  if (canWriteRich) {
    const coreData = {
      'text/html': html,
      'text/plain': plainText,
    }
    const includeMarkdown = supportsMarkdown(ClipboardItemConstructor)
    const richData = includeMarkdown
      ? { ...coreData, 'text/markdown': markdown }
      : coreData

    try {
      await clipboard.write([
        createClipboardItem(
          ClipboardItemConstructor,
          BlobConstructor,
          richData,
        ),
      ])
      return { formats: Object.keys(richData), kind: 'rich' }
    } catch (error) {
      if (includeMarkdown) {
        try {
          await clipboard.write([
            createClipboardItem(
              ClipboardItemConstructor,
              BlobConstructor,
              coreData,
            ),
          ])
          return { formats: Object.keys(coreData), kind: 'rich' }
        } catch {
          // Continue to the required plain-text fallback.
        }
      }

      if (typeof clipboard.writeText !== 'function') {
        throw new Error(
          'The browser blocked clipboard access. Check permissions and try again.',
          { cause: error },
        )
      }
    }
  }

  if (typeof clipboard.writeText === 'function') {
    try {
      await clipboard.writeText(plainText)
      return { formats: ['text/plain'], kind: 'plain' }
    } catch (error) {
      throw new Error(
        'The browser blocked clipboard access. Check permissions and try again.',
        { cause: error },
      )
    }
  }

  throw new Error(
    'Clipboard access is unavailable. Check your browser permissions and try again.',
  )
}
