import { describe, expect, it } from 'vitest'

import { readMarkdownFile } from './read-markdown-file.js'

describe('readMarkdownFile', () => {
  it('reads text and preserves an empty file', async () => {
    await expect(readMarkdownFile(new File(['# Hello'], 'hello.md'))).resolves.toBe(
      '# Hello',
    )
    await expect(readMarkdownFile(new File([], 'empty.md'))).resolves.toBe('')
  })

  it('rejects clearly binary content', async () => {
    await expect(
      readMarkdownFile(new File(['valid\u0000binary'], 'binary.md')),
    ).rejects.toThrow('does not appear to contain readable Markdown text')
  })

  it('turns read failures into an actionable intake error', async () => {
    const inaccessibleFile = {
      text: () => Promise.reject(new Error('Permission denied')),
    }

    await expect(readMarkdownFile(inaccessibleFile)).rejects.toThrow(
      'We could not read this file.',
    )
  })
})
