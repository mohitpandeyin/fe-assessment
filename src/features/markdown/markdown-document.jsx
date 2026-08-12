import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import {
  ImageFallback,
  ReadOnlyTask,
  SafeLink,
  ScrollableCodeBlock,
  ScrollableTable,
} from './markdown-components.jsx'
import { MarkdownErrorBoundary } from './markdown-error-boundary.jsx'

const remarkPlugins = [remarkGfm]
const markdownComponents = {
  a: SafeLink,
  img: ImageFallback,
  input: ReadOnlyTask,
  pre: ScrollableCodeBlock,
  table: ScrollableTable,
}

export function MarkdownDocument({ resetKey, source }) {
  return (
    <MarkdownErrorBoundary resetKey={resetKey}>
      {source.length === 0 ? (
        <div className="markdown-empty" role="status">
          <h2>This Markdown file is empty</h2>
          <p>Replace it with another file or start over when you are ready.</p>
        </div>
      ) : (
        <article
          aria-label="Rendered Markdown document"
          className="markdown-document"
        >
          <ReactMarkdown
            components={markdownComponents}
            remarkPlugins={remarkPlugins}
            skipHtml
          >
            {source}
          </ReactMarkdown>
        </article>
      )}
    </MarkdownErrorBoundary>
  )
}
