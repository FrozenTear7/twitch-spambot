import { postingCooldown } from '../postingCooldown'

describe('postingCooldown', () => {
  test('return true for same messages in cooldown', () => {
    const msg = 'same message'
    const prevMsg = 'same message'
    const prevTimestamp = Date.now() - 1000

    expect(postingCooldown(msg, prevMsg, prevTimestamp)).toBe(false)
  })

  test('return false for different messages', () => {
    const msg = 'test message'
    const prevMsg = 'different message'
    const prevTimestamp = Date.now() - 1000

    expect(postingCooldown(msg, prevMsg, prevTimestamp)).toBe(true)
  })

  test('return false for same messages after cooldown', () => {
    const msg = 'same message'
    const prevMsg = 'same message'
    const prevTimestamp = Date.now() - 40000

    expect(postingCooldown(msg, prevMsg, prevTimestamp)).toBe(true)
  })
})
