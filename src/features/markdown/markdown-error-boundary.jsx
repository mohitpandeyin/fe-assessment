import { Component } from 'react'

export class MarkdownErrorBoundary extends Component {
  state = {
    error: null,
    resetKey: this.props.resetKey,
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.resetKey !== state.resetKey) {
      return {
        error: null,
        resetKey: props.resetKey,
      }
    }

    return null
  }

  render() {
    if (this.state.error) {
      return (
        <div className="markdown-render-error" role="alert">
          <h2>Preview unavailable</h2>
          <p>
            Plainmark could not render this document. Replace the file or start
            over to continue.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
