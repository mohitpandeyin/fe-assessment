import { describe, expect, it } from 'vitest'

import {
  countWords,
  createFileMetadata,
  formatFileSize,
} from './file-metadata.js'

describe('file metadata', () => {
  it('formats byte sizes for display', () => {
    expect(formatFileSize(0)).toBe('0 bytes')
    expect(formatFileSize(1)).toBe('1 byte')
    expect(formatFileSize(1536)).toBe('1.5 KB')
    expect(formatFileSize(2 * 1024 * 1024)).toBe('2.0 MB')
    expect(formatFileSize(Number.NaN)).toBe('Unknown')
  })

  it('counts readable Unicode words without Markdown markers', () => {
    expect(countWords('# Hello, café 世界\n\nwell-tested')).toBe(4)
    expect(countWords('')).toBe(0)
  })

  it('builds metadata only from local file data and source', () => {
    expect(
      createFileMetadata({ name: 'notes.md', size: 12 }, '# Hello world'),
    ).toEqual({
      name: 'notes.md',
      type: 'Markdown',
      size: 12,
      formattedSize: '12 bytes',
      wordCount: 2,
    })
  })
})
