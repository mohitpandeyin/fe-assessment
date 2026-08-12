import { FileIntakeError } from './file-intake-error.js'

export const MAX_MARKDOWN_FILE_SIZE = 5 * 1024 * 1024

const MARKDOWN_EXTENSION_PATTERN = /\.(md|markdown)$/i

function toFileArray(files) {
  return Array.from(files ?? []).filter(Boolean)
}

export function validateMarkdownFiles(files) {
  const candidates = toFileArray(files)

  if (candidates.length === 0) {
    throw new FileIntakeError(
      'missing-file',
      'Choose one Markdown file to continue.',
    )
  }

  if (candidates.length > 1) {
    throw new FileIntakeError(
      'multiple-files',
      'Choose one Markdown file at a time.',
    )
  }

  const [file] = candidates

  if (!MARKDOWN_EXTENSION_PATTERN.test(file.name ?? '')) {
    throw new FileIntakeError(
      'unsupported-extension',
      'Choose a file ending in .md or .markdown.',
    )
  }

  if (file.size > MAX_MARKDOWN_FILE_SIZE) {
    throw new FileIntakeError(
      'file-too-large',
      'Choose a Markdown file that is 5 MB or smaller.',
    )
  }

  return file
}
