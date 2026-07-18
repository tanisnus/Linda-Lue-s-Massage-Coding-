import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  FULL_NAME_MAX_LENGTH,
  getFullNameFieldError,
  isValidFullName,
  normalizeFullName,
  validateFullName,
} from '../shared/nameUtils.ts'

describe('validateFullName', () => {
  it('accepts common valid names', () => {
    assert.equal(validateFullName('John Smith'), null)
    assert.equal(validateFullName('José García'), null)
    assert.equal(validateFullName("O'Brien"), null)
    assert.equal(validateFullName('Mary-Jane Watson'), null)
    assert.equal(validateFullName('J. Smith'), null)
    assert.equal(validateFullName('Madonna'), null)
    assert.equal(validateFullName('Müller'), null)
  })

  it('rejects numbers and symbols', () => {
    assert.equal(validateFullName('John123'), 'Full name cannot contain numbers')
    assert.equal(
      validateFullName('<script>alert(1)</script>'),
      'Full name can only contain letters, spaces, hyphens, apostrophes, and periods'
    )
  })

  it('rejects empty and whitespace-only input', () => {
    assert.equal(validateFullName(''), 'Please enter your full name')
    assert.equal(validateFullName('   '), 'Please enter your full name')
  })

  it('rejects names longer than the max length', () => {
    const longName = 'A'.repeat(FULL_NAME_MAX_LENGTH + 1)
    assert.equal(
      validateFullName(longName),
      'Full name must be 100 characters or less'
    )
  })
})

describe('normalizeFullName', () => {
  it('trims and collapses whitespace', () => {
    assert.equal(normalizeFullName('  John    Smith  '), 'John Smith')
  })
})

describe('getFullNameFieldError', () => {
  it('does not require a name while typing', () => {
    assert.equal(getFullNameFieldError('', 'input'), '')
  })

  it('flags invalid characters while typing', () => {
    assert.equal(getFullNameFieldError('John123', 'input'), 'Full name cannot contain numbers')
  })
})

describe('isValidFullName', () => {
  it('returns false for invalid names', () => {
    assert.equal(isValidFullName('John123'), false)
    assert.equal(isValidFullName('John Smith'), true)
  })
})
