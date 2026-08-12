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
        { name: 'large.md', size: 5 * 1024 * 1024 + 1 },
      ]),
    ).toThrow('Choose a Markdown file that is 5 MB or smaller.')
  })
})
