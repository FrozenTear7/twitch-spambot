import { getBaseSpam } from '../spamUtils'

describe('getBaseSpam', () => {
  test('leaves base spam as is', () => {
    const msg = 'test'

    expect(getBaseSpam(msg)).toBe(msg)
  })

  test('properly finds repeated spam', () => {
    const msg = 'testing LuL testing LuL testing LuL'
    const expectedOutput = 'testing LuL'

    expect(getBaseSpam(msg)).toBe(expectedOutput)
  })

  test('properly strips regex unsafe characters', () => {
    const msg = 'test \\/ test \\/'
    const expectedOutput = 'test \\/'

    expect(getBaseSpam(msg)).toBe(expectedOutput)
  })

  test('message too short returns itself', () => {
    const msg = 'tt'

    expect(getBaseSpam(msg)).toBe(msg)
  })

  test('no regex matches return msg', () => {
    const msg = 'test'

    jest.spyOn(String.prototype, 'match').mockReturnValue(null)

    expect(getBaseSpam(msg)).toBe(msg)
  })
})
