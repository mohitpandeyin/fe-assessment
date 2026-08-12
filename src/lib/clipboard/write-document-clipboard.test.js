import { describe, expect, it, vi } from 'vitest'

import { writeDocumentClipboard } from './write-document-clipboard.js'

class MockBlob {
  constructor(parts, options) {
    this.parts = parts
    this.type = options.type
  }
}

function createRoot() {
  const root = document.createElement('article')
  root.innerHTML = '<h1>Copy me</h1><p>A complete document.</p>'
  return root
}

function createClipboardItemConstructor({ markdownSupported = true } = {}) {
  return class MockClipboardItem {
    static supports(type) {
      return type === 'text/markdown' && markdownSupported
    }

    constructor(data) {
      this.data = data
      this.types = Object.keys(data)
    }
  }
}

describe('writeDocumentClipboard', () => {
  it('writes HTML, plain text, and exact Markdown together when supported', async () => {
    const clipboard = { write: vi.fn().mockResolvedValue() }
    const ClipboardItemConstructor = createClipboardItemConstructor()

    const result = await writeDocumentClipboard({
      BlobConstructor: MockBlob,
      ClipboardItemConstructor,
      clipboard,
      markdown: '# Exact source',
      root: createRoot(),
    })

    expect(result).toEqual({
      formats: ['text/html', 'text/plain', 'text/markdown'],
      kind: 'rich',
    })
    const [item] = clipboard.write.mock.calls[0][0]
    expect(item.types).toEqual(['text/html', 'text/plain', 'text/markdown'])
    expect(item.data['text/markdown'].parts).toEqual(['# Exact source'])
  })

  it('omits unsupported Markdown without weakening rich copy', async () => {
    const clipboard = { write: vi.fn().mockResolvedValue() }

    await expect(
      writeDocumentClipboard({
        BlobConstructor: MockBlob,
        ClipboardItemConstructor: createClipboardItemConstructor({
          markdownSupported: false,
        }),
        clipboard,
        markdown: '# Source',
        root: createRoot(),
      }),
    ).resolves.toEqual({
      formats: ['text/html', 'text/plain'],
      kind: 'rich',
    })
  })

  it('retries rich copy without Markdown before using plain text', async () => {
    const clipboard = {
      write: vi
        .fn()
        .mockRejectedValueOnce(new Error('Custom type rejected'))
        .mockResolvedValueOnce(),
      writeText: vi.fn(),
    }

    const result = await writeDocumentClipboard({
      BlobConstructor: MockBlob,
      ClipboardItemConstructor: createClipboardItemConstructor(),
      clipboard,
      markdown: '# Source',
      root: createRoot(),
    })

    expect(result).toEqual({
      formats: ['text/html', 'text/plain'],
      kind: 'rich',
    })
    expect(clipboard.write).toHaveBeenCalledTimes(2)
    expect(clipboard.writeText).not.toHaveBeenCalled()
  })

  it('falls back to semantic plain text when rich writing fails', async () => {
    const clipboard = {
      write: vi.fn().mockRejectedValue(new Error('Denied')),
      writeText: vi.fn().mockResolvedValue(),
    }

    const result = await writeDocumentClipboard({
      BlobConstructor: MockBlob,
      ClipboardItemConstructor: createClipboardItemConstructor({
        markdownSupported: false,
      }),
      clipboard,
      markdown: '# Source',
      root: createRoot(),
    })

    expect(result.kind).toBe('plain')
    expect(clipboard.writeText).toHaveBeenCalledWith(
      'Copy me\n\nA complete document.',
    )
  })

  it('reports a useful failure when every clipboard path is blocked', async () => {
    const clipboard = {
      writeText: vi.fn().mockRejectedValue(new Error('Denied')),
    }

    await expect(
      writeDocumentClipboard({
        BlobConstructor: MockBlob,
        ClipboardItemConstructor: undefined,
        clipboard,
        markdown: '# Source',
        root: createRoot(),
      }),
    ).rejects.toThrow('The browser blocked clipboard access')
  })
})
