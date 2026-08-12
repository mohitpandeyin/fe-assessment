import { createFileMetadata } from './file-metadata.js'
import { readMarkdownFile } from './read-markdown-file.js'
import { validateMarkdownFiles } from './validate-markdown-file.js'

export async function loadMarkdownDocument(files) {
  const file = validateMarkdownFiles(files)
  const source = await readMarkdownFile(file)

  return {
    file,
    source,
    metadata: createFileMetadata(file, source),
  }
}
