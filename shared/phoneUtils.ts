/** US-only NANP (North American Numbering Plan) phone helpers for this spa booking flow. */
export const US_PHONE_DIGIT_LENGTH = 10

const RESERVED_N11_AREA_CODES = new Set([
  '211', '311', '411', '511', '611', '711', '811', '911',
])

function isValidNanpSegmentStart(digit: string | undefined): boolean {
  return digit !== undefined && digit >= '2' && digit <= '9'
}

function isReservedN11AreaCode(areaCode: string): boolean {
  return RESERVED_N11_AREA_CODES.has(areaCode)
}

export function sanitizePhoneDigits(value: string): string {
  let digits = value.replace(/\D/g, '')

  // Strip one leading US country code from values like +1 (818) 123-4567.
  if (digits.length >= 11 && digits.startsWith('1')) {
    digits = digits.slice(1)
  }

  return digits.slice(0, US_PHONE_DIGIT_LENGTH)
}

export function formatPhoneNumber(digits: string): string {
  if (!digits) return ''

  if (digits.length <= 3) {
    return digits.length === 0 ? '' : `(${digits}`
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, US_PHONE_DIGIT_LENGTH)}`
}

export function validatePhoneDigits(digits: string): string | null {
  if (!digits) {
    return 'Please enter your phone number'
  }

  if (!/^\d+$/.test(digits)) {
    return 'Phone number must contain digits only'
  }

  if (digits.length !== US_PHONE_DIGIT_LENGTH) {
    return 'Phone number must be 10 digits'
  }

  const areaCode = digits.slice(0, 3)
  const exchangeCode = digits.slice(3, 6)

  if (!isValidNanpSegmentStart(areaCode[0]) || !isValidNanpSegmentStart(exchangeCode[0])) {
    return 'Please enter a valid US phone number'
  }

  if (isReservedN11AreaCode(areaCode)) {
    return 'Please enter a valid US phone number'
  }

  if (/^(\d)\1{9}$/.test(digits)) {
    return 'Please enter a valid phone number'
  }

  return null
}

export function getPhoneFieldError(digits: string, mode: 'input' | 'blur' = 'input'): string {
  if (!digits) {
    return 'Please enter your phone number'
  }

  if (digits.length >= 1 && !isValidNanpSegmentStart(digits[0])) {
    return 'Please enter a valid US phone number'
  }

  if (digits.length >= 3 && isReservedN11AreaCode(digits.slice(0, 3))) {
    return 'Please enter a valid US phone number'
  }

  if (digits.length >= 4 && !isValidNanpSegmentStart(digits[3])) {
    return 'Please enter a valid US phone number'
  }

  if (mode === 'blur' || digits.length === US_PHONE_DIGIT_LENGTH) {
    return validatePhoneDigits(digits) || ''
  }

  return ''
}

export function normalizePhoneForSubmit(digits: string): string {
  return formatPhoneNumber(sanitizePhoneDigits(digits))
}

export function isValidPhone(phone: string): boolean {
  return validatePhoneDigits(sanitizePhoneDigits(phone)) === null
}

export function normalizePhoneForStorage(phone: string): string {
  return formatPhoneNumber(sanitizePhoneDigits(phone))
}
