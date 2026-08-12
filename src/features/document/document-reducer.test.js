import { describe, expect, it } from 'vitest'

import {
  documentReducer,
  initialDocumentState,
} from './document-reducer.js'

const document = {
  source: '# Ready',
  metadata: { name: 'ready.md' },
}

describe('documentReducer', () => {
  it('moves from empty to reading and then ready', () => {
    const reading = documentReducer(initialDocumentState, {
      type: 'read-started',
    })
    const ready = documentReducer(reading, {
      type: 'read-succeeded',
      document,
    })

    expect(reading).toMatchObject({ status: 'reading', error: null })
    expect(ready).toEqual({
      status: 'ready',
      activeDocument: document,
      error: null,
    })
  })

  it('preserves the active document while replacing and after failure', () => {
    const ready = {
      status: 'ready',
      activeDocument: document,
      error: null,
    }
    const replacing = documentReducer(ready, { type: 'read-started' })
    const failed = documentReducer(replacing, {
      type: 'read-failed',
      message: 'Could not replace',
    })

    expect(replacing).toMatchObject({
      status: 'replacing',
      activeDocument: document,
    })
    expect(failed).toEqual({
      status: 'ready',
      activeDocument: document,
      error: 'Could not replace',
    })
  })

  it('uses a recoverable error state when the first read fails', () => {
    expect(
      documentReducer(
        { ...initialDocumentState, status: 'reading' },
        { type: 'read-failed', message: 'Unreadable' },
      ),
    ).toEqual({
      status: 'error',
      activeDocument: null,
      error: 'Unreadable',
    })
  })

  it('clears all document state', () => {
    expect(
      documentReducer(
        { status: 'ready', activeDocument: document, error: 'Old error' },
        { type: 'cleared' },
      ),
    ).toBe(initialDocumentState)
  })
})
