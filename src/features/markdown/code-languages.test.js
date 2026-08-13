import { describe, expect, it } from 'vitest'

import {
  getNotionCodeLanguageClassToken,
  getNotionCodeLanguageLabel,
  normalizeNotionCodeLanguage,
  NOTION_CODE_LANGUAGE_VALUES,
} from './code-languages.js'

describe('Notion code languages', () => {
  it('contains every requested Notion language value without duplicates', () => {
    expect(new Set(NOTION_CODE_LANGUAGE_VALUES).size).toBe(
      NOTION_CODE_LANGUAGE_VALUES.length,
    )
    expect(NOTION_CODE_LANGUAGE_VALUES).toEqual(
      expect.arrayContaining([
        'abap',
        'ascii art',
        'c#',
        'c++',
        'llvm ir',
        'notion formula',
        'plain text',
        'rocq',
        'toml',
        'visual basic',
        'webassembly',
      ]),
    )
  })

  it.each([
    ['js', 'javascript', 'JavaScript', 'javascript'],
    ['csharp', 'c#', 'C#', 'csharp'],
    ['cpp', 'c++', 'C++', 'cpp'],
    ['text', 'plain text', 'Plain Text', 'plaintext'],
    ['notion-formula', 'notion formula', 'Notion Formula', 'notion-formula'],
    ['vbnet', 'vb.net', 'VB.Net', 'vbnet'],
    ['wasm', 'webassembly', 'WebAssembly', 'webassembly'],
    ['yml', 'yaml', 'YAML', 'yaml'],
  ])(
    'normalizes %s to portable Notion metadata',
    (source, language, label, classToken) => {
      expect(normalizeNotionCodeLanguage(source)).toBe(language)
      expect(getNotionCodeLanguageLabel(source)).toBe(label)
      expect(getNotionCodeLanguageClassToken(source)).toBe(classToken)
    },
  )

  it('uses Plain Text for missing or unsupported fence languages', () => {
    expect(normalizeNotionCodeLanguage('')).toBe('plain text')
    expect(normalizeNotionCodeLanguage('unknown-language')).toBe('plain text')
  })
})
