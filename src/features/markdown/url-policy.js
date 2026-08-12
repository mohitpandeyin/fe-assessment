const EXTERNAL_PROTOCOLS = new Set(['http:', 'https:'])
const DIRECT_PROTOCOLS = new Set(['mailto:'])

export function getUrlPolicy(value) {
  const url = String(value ?? '').trim()

  if (!url) {
    return { kind: 'blocked', url: '' }
  }

  if (url.startsWith('#')) {
    return { kind: 'anchor', url }
  }

  try {
    const parsedUrl = new URL(url)

    if (EXTERNAL_PROTOCOLS.has(parsedUrl.protocol)) {
      return { kind: 'external', url: parsedUrl.href }
    }

    if (DIRECT_PROTOCOLS.has(parsedUrl.protocol)) {
      return { kind: 'direct', url: parsedUrl.href }
    }

    return { kind: 'blocked', url: '' }
  } catch {
    return { kind: 'relative', url: '' }
  }
}
