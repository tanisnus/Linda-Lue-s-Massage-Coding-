import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { escapeHtml, sanitizeUrl } from '../shared/htmlUtils.ts'

describe('escapeHtml', () => {
  it('escapes HTML special characters', () => {
    assert.equal(
      escapeHtml('<script>alert("x")</script>'),
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;'
    )
  })
})

describe('sanitizeUrl', () => {
  it('allows http and https URLs', () => {
    assert.equal(
      sanitizeUrl('https://calendar.google.com/calendar/render?action=TEMPLATE'),
      'https://calendar.google.com/calendar/render?action=TEMPLATE'
    )
  })

  it('blocks javascript URLs', () => {
    assert.equal(sanitizeUrl('javascript:alert(1)'), '#')
  })
})
