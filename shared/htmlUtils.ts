export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '#'
    }
    return parsed.toString()
  } catch {
    return '#'
  }
}

export function sanitizeEmailSubject(value: string): string {
  return value.replace(/[\r\n]/g, ' ').trim().slice(0, 200)
}
