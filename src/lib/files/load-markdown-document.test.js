import { describe, expect, it } from 'vitest'

import { loadMarkdownDocument } from './load-markdown-document.js'

describe('loadMarkdownDocument', () => {
  it('uses one validation and read pipeline for a document', async () => {
    const file = new File(['# Local document'], 'local.md')

    await expect(loadMarkdownDocument([file])).resolves.toMatchObject({
      file,
      source: '# Local document',
      metadata: {
        name: 'local.md',
        type: 'Markdown',
        wordCount: 2,
      },
    })
  })
})
