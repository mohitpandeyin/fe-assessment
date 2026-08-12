import { FileIntakeError } from './file-intake-error.js'

const SAMPLE_SIZE = 8192
function appearsBinary(source) {
  const sample = source.slice(0, SAMPLE_SIZE)

  if (sample.includes('\u0000')) {
    return true
  }

  const controlCharacters = Array.from(sample).filter((character) => {
    const codePoint = character.codePointAt(0)
    return (
      (codePoint >= 1 && codePoint <= 8) ||
      codePoint === 11 ||
      codePoint === 12 ||
      (codePoint >= 14 && codePoint <= 31)
    )
  }).length

  return sample.length > 0 && controlCharacters / sample.length > 0.1
}

function readWithFileReader(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('load', () => resolve(String(reader.result ?? '')))
    reader.addEventListener('error', () => reject(reader.error))
    reader.readAsText(file)
  })
}

export async function readMarkdownFile(file) {
  try {
    const source =
      typeof file.text === 'function'
        ? await file.text()
        : await readWithFileReader(file)

    if (appearsBinary(source)) {
      throw new FileIntakeError(
        'binary-file',
        'This file does not appear to contain readable Markdown text.',
      )
    }

    return source
  } catch (error) {
    if (error instanceof FileIntakeError) {
      throw error
    }

    throw new FileIntakeError(
      'read-failed',
      'We could not read this file. Check that it is accessible and try again.',
      { cause: error },
    )
  }
}
