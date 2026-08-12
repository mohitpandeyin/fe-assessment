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
import { highlightCode } from './highlight-code.js'

const remarkPlugins = [remarkGfm]
const rehypePlugins = [highlightCode]
const markdownComponents = {
  a: SafeLink,
  img: ImageFallback,
  input: ReadOnlyTask,
  pre: ScrollableCodeBlock,
  table: ScrollableTable,
}

export function MarkdownDocument({ articleRef, resetKey, source }) {
  return (
    <MarkdownErrorBoundary resetKey={resetKey}>
      <article
        ref={articleRef}
        aria-label="Rendered Markdown document"
        className="markdown-document"
      >
        {source.length > 0 ? (
          <ReactMarkdown
            components={markdownComponents}
            rehypePlugins={rehypePlugins}
            remarkPlugins={remarkPlugins}
            skipHtml
          >
            {source}
          </ReactMarkdown>
        ) : null}
      </article>
      {source.length === 0 ? (
        <div className="markdown-empty" role="status">
          <h2>This Markdown file is empty</h2>
          <p>Replace it with another file or start over when you are ready.</p>
        </div>
      ) : null}
    </MarkdownErrorBoundary>
  )
}
