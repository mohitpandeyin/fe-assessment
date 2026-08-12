import { describe, expect, it } from 'vitest'

import { getUrlPolicy } from './url-policy.js'

describe('getUrlPolicy', () => {
  it('allows external, email, and same-document links', () => {
    expect(getUrlPolicy('https://example.com/docs')).toEqual({
      kind: 'external',
      url: 'https://example.com/docs',
    })
    expect(getUrlPolicy('mailto:hello@example.com')).toEqual({
      kind: 'direct',
      url: 'mailto:hello@example.com',
    })
    expect(getUrlPolicy('#summary')).toEqual({
      kind: 'anchor',
      url: '#summary',
    })
  })

  it('classifies relative and unsafe URLs without making them navigable', () => {
    expect(getUrlPolicy('./guide.md')).toEqual({
      kind: 'relative',
      url: '',
    })
    expect(getUrlPolicy('javascript:alert(1)')).toEqual({
      kind: 'blocked',
      url: '',
    })
    expect(getUrlPolicy('data:text/html,unsafe')).toEqual({
      kind: 'blocked',
      url: '',
    })
  })
})
