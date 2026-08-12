const WORD_PATTERN = /[\p{L}\p{N}]+(?:['’_-][\p{L}\p{N}]+)*/gu

export function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return 'Unknown'
  }

  if (bytes < 1024) {
    return `${bytes} ${bytes === 1 ? 'byte' : 'bytes'}`
  }

  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unitIndex = 0

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  const precision = value >= 10 ? 0 : 1
  return `${value.toFixed(precision)} ${units[unitIndex]}`
}

export function countWords(source) {
  return source.match(WORD_PATTERN)?.length ?? 0
}

export function createFileMetadata(file, source) {
  return {
    name: file.name,
    type: 'Markdown',
    size: file.size,
    formattedSize: formatFileSize(file.size),
    wordCount: countWords(source),
  }
}
