export const FULL_NAME_MAX_LENGTH = 100
export const FULL_NAME_MIN_LENGTH = 1

const ALLOWED_NAME_CHARS = /^[\p{L}\s'.-]*$/u
const VALID_NAME = /^[\p{L}][\p{L}\s'.-]*$|^[\p{L}]$/u
const NAME_WITH_DIGITS_ONLY = /^[\p{L}\s'.0-9-]+$/u

export function normalizeFullName(value: string): string {
  return value.trim().replace(/\s+/g, ' ').slice(0, FULL_NAME_MAX_LENGTH)
}

export function validateFullName(value: string): string | null {
  if (!value.trim()) {
    return 'Please enter your full name'
  }

  const normalized = normalizeFullName(value)

  if (normalized.length < FULL_NAME_MIN_LENGTH) {
    return 'Please enter your full name'
  }

  if (value.trim().replace(/\s+/g, ' ').length > FULL_NAME_MAX_LENGTH) {
    return 'Full name must be 100 characters or less'
  }

  if (!ALLOWED_NAME_CHARS.test(normalized)) {
    if (/[0-9]/.test(normalized) && NAME_WITH_DIGITS_ONLY.test(normalized)) {
      return 'Full name cannot contain numbers'
    }
    return 'Full name can only contain letters, spaces, hyphens, apostrophes, and periods'
  }

  if (!VALID_NAME.test(normalized)) {
    return 'Full name can only contain letters, spaces, hyphens, apostrophes, and periods'
  }

  return null
}

export function getFullNameFieldError(value: string, mode: 'input' | 'blur' = 'input'): string {
  if (!value.trim()) {
    return mode === 'blur' ? 'Please enter your full name' : ''
  }

  if (value.length > FULL_NAME_MAX_LENGTH) {
    return 'Full name must be 100 characters or less'
  }

  if (!ALLOWED_NAME_CHARS.test(value)) {
    if (/[0-9]/.test(value) && NAME_WITH_DIGITS_ONLY.test(value)) {
      return 'Full name cannot contain numbers'
    }
    return 'Full name can only contain letters, spaces, hyphens, apostrophes, and periods'
  }

  if (mode === 'blur') {
    return validateFullName(value) || ''
  }

  return ''
}

export function isValidFullName(value: string): boolean {
  return validateFullName(value) === null
}
