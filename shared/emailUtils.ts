const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string): string | null {
  if (!email) {
    return null
  }

  const trimmed = email.trim()

  if (!trimmed.includes('@')) {
    return 'Email must include @ symbol'
  }

  if (trimmed.startsWith('@')) {
    return 'Email cannot start with @'
  }

  const atParts = trimmed.split('@')
  if (atParts.length > 2) {
    return 'Email can only contain one @ symbol'
  }

  const localPart = atParts[0]
  const domainPart = atParts[1] ?? ''

  if (localPart.startsWith('.')) {
    return 'Email address cannot start with a dot before @'
  }

  if (localPart.endsWith('.')) {
    return 'Email address cannot end with a dot before @'
  }

  if (localPart.includes('..')) {
    return 'Email address cannot contain consecutive dots'
  }

  if (!domainPart.includes('.')) {
    return 'Email must include a domain (e.g., @gmail.com)'
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Please enter a valid email address (e.g., name@gmail.com)'
  }

  return null
}

export function isValidEmail(email: string): boolean {
  return email.trim().length > 0 && validateEmail(email) === null
}
