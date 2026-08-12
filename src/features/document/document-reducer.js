export const initialDocumentState = {
  status: 'empty',
  activeDocument: null,
  error: null,
}

export function documentReducer(state, action) {
  switch (action.type) {
    case 'read-started':
      return {
        ...state,
        status: state.activeDocument ? 'replacing' : 'reading',
        error: null,
      }

    case 'read-succeeded':
      return {
        status: 'ready',
        activeDocument: action.document,
        error: null,
      }

    case 'read-failed':
      return state.activeDocument
        ? {
            ...state,
            status: 'ready',
            error: action.message,
          }
        : {
            status: 'error',
            activeDocument: null,
            error: action.message,
          }

    case 'error-dismissed':
      return {
        ...state,
        status: state.activeDocument ? 'ready' : 'empty',
        error: null,
      }

    case 'cleared':
      return initialDocumentState

    default:
      return state
  }
}
