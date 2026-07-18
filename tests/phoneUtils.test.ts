import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  sanitizePhoneDigits,
  validatePhoneDigits,
  isValidPhone,
} from '../shared/phoneUtils.ts'

describe('sanitizePhoneDigits', () => {
  it('strips formatting characters', () => {
    assert.equal(sanitizePhoneDigits('(818) 555-1234'), '8185551234')
  })

  it('strips a leading US country code from pasted values', () => {
    assert.equal(sanitizePhoneDigits('+1 (818) 123-4567'), '8181234567')
    assert.equal(sanitizePhoneDigits('+18181234567'), '8181234567')
  })

  it('truncates long pasted strings to 10 digits', () => {
    assert.equal(sanitizePhoneDigits('23456789012345678901'), '2345678901')
    assert.equal(sanitizePhoneDigits('+181812345678901234'), '8181234567')
  })
})

describe('validatePhoneDigits', () => {
  it('accepts a valid US number', () => {
    assert.equal(validatePhoneDigits('8185551234'), null)
  })

  it('rejects exchange codes starting with 0', () => {
    assert.equal(
      validatePhoneDigits('5550123456'),
      'Please enter a valid US phone number'
    )
  })

  it('rejects exchange codes starting with 1', () => {
    assert.equal(
      validatePhoneDigits('5551234567'),
      'Please enter a valid US phone number'
    )
  })

  it('rejects reserved N11 area codes', () => {
    for (const areaCode of ['211', '311', '411', '511', '611', '711', '811', '911']) {
      assert.equal(
        validatePhoneDigits(`${areaCode}5551234`),
        'Please enter a valid US phone number',
        `expected ${areaCode} to be rejected`
      )
    }
  })

  it('rejects area codes starting with 0 or 1', () => {
    assert.equal(validatePhoneDigits('0555551234'), 'Please enter a valid US phone number')
    assert.equal(validatePhoneDigits('1555551234'), 'Please enter a valid US phone number')
  })
})

describe('isValidPhone', () => {
  it('validates pasted numbers with a country code', () => {
    assert.equal(isValidPhone('+1 (818) 555-1234'), true)
  })

  it('rejects malformed bypass payloads', () => {
    assert.equal(isValidPhone('not-a-phone'), false)
    assert.equal(isValidPhone('9115551234'), false)
  })
})
