import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { isValidEmail, validateEmail } from '../shared/emailUtils.ts'

describe('validateEmail local-part dot rules', () => {
  it('rejects consecutive dots in the local part', () => {
    assert.equal(
      validateEmail('user..name@example.com'),
      'Email address cannot contain consecutive dots'
    )
    assert.equal(isValidEmail('user..name@example.com'), false)
  })

  it('rejects a leading dot in the local part', () => {
    assert.equal(
      validateEmail('.user@example.com'),
      'Email address cannot start with a dot before @'
    )
    assert.equal(isValidEmail('.user@example.com'), false)
  })

  it('rejects a trailing dot in the local part', () => {
    assert.equal(
      validateEmail('user.@example.com'),
      'Email address cannot end with a dot before @'
    )
    assert.equal(isValidEmail('user.@example.com'), false)
  })
})

describe('validateEmail valid examples', () => {
  it('accepts a normal email address', () => {
    assert.equal(validateEmail('name@gmail.com'), null)
    assert.equal(isValidEmail('name@gmail.com'), true)
  })
})
