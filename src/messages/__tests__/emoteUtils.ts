import { mocked } from 'ts-jest/utils'
import { fetchWhitelistedEmotes } from '../fetchWhitelistedEmotes'
import { getAllowedEmotes, hasSubEmotes } from '../emoteUtils'
import { fetchGlobalEmotes } from '../fetchEmotes'

jest.mock('./../../../src/messages/fetchEmotes')
jest.mock('./../../../src/messages/fetchWhitelistedEmotes')

describe('emoteUtils', () => {
  test('print correct output to the console', async () => {
    const whitelistChannels = ['123321']
    const emoteArray1 = ['1']
    const emoteArray2 = ['2']
    const emoteArrayCombined = [...emoteArray1, ...emoteArray2]

    const fetchGlobalEmotesMock = mocked(fetchGlobalEmotes, true)
    fetchGlobalEmotesMock.mockImplementation(() => {
      return new Promise((resolve) => resolve(emoteArray1))
    })

    const fetchWhitelistedEmotesMock = mocked(fetchWhitelistedEmotes, true)
    fetchWhitelistedEmotesMock.mockImplementation(() => {
      return new Promise((resolve) => resolve(emoteArray2))
    })

    const result = await getAllowedEmotes(whitelistChannels)

    expect(fetchGlobalEmotesMock).toBeCalledTimes(1)
    expect(fetchGlobalEmotesMock).toBeCalledWith()

    expect(fetchWhitelistedEmotesMock).toBeCalledTimes(1)
    expect(fetchWhitelistedEmotesMock).toBeCalledWith(whitelistChannels)

    expect(result).toStrictEqual(emoteArrayCombined)
  })
})

describe('hasSubEmotes', () => {
  test('returns false for empty emoteCodes array', () => {
    const allowedEmotes = ['123', '456']
    const emoteCodes: string[] = []

    const result = hasSubEmotes(allowedEmotes, emoteCodes)

    expect(result).toStrictEqual(false)
  })

  test('returns false for intersecting emote codes', () => {
    const allowedEmotes = ['123', '456']
    const emoteCodes = ['123']

    const result = hasSubEmotes(allowedEmotes, emoteCodes)

    expect(result).toStrictEqual(false)
  })

  test('print correct output to the console', () => {
    const allowedEmotes = ['123', '456']
    const emoteCodes = ['789']

    const result = hasSubEmotes(allowedEmotes, emoteCodes)

    expect(result).toStrictEqual(true)
  })
})
