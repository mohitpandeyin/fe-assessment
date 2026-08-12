import { describe, expect, it } from 'vitest'

import { validateMarkdownFiles } from './validate-markdown-file.js'

describe('validateMarkdownFiles', () => {
  it.each(['notes.md', 'NOTES.MD', 'notes.markdown'])('accepts %s', (name) => {
    const file = new File(['# Notes'], name)

    expect(validateMarkdownFiles([file])).toBe(file)
  })

  it('accepts empty Markdown files', () => {
    expect(validateMarkdownFiles([new File([], 'empty.md')]).size).toBe(0)
  })

  it('accepts a file exactly at the one-megabyte boundary', () => {
    const file = { name: 'boundary.md', size: 1024 * 1024 }

    expect(validateMarkdownFiles([file])).toBe(file)
  })

  it('rejects missing, multiple, unsupported, and oversized inputs', () => {
    expect(() => validateMarkdownFiles([])).toThrow(
      'Choose one Markdown file to continue.',
    )
    expect(() =>
      validateMarkdownFiles([
        new File(['a'], 'a.md'),
        new File(['b'], 'b.md'),
      ]),
    ).toThrow('Choose one Markdown file at a time.')
    expect(() =>
      validateMarkdownFiles([new File(['text'], 'notes.txt')]),
    ).toThrow('Choose a file ending in .md or .markdown.')
    expect(() =>
      validateMarkdownFiles([
        { name: 'large.md', size: 1024 * 1024 + 1 },
      ]),
    ).toThrow('Choose a Markdown file that is 1 MB or smaller.')
  })
})
