import { globalChannel } from './../../../src/utils/constants'
import { fetchEmotes } from './../../../src/messages/fetchEmotes'
import { fetchWhitelistedEmotes } from './../../../src/messages/fetchWhitelistedEmotes'
import {
  getAllowedEmotes,
  hasSubEmotes,
} from './../../../src/messages/emoteUtils'
import { mocked } from 'ts-jest/utils'

jest.mock('./../../../src/messages/fetchEmotes')
jest.mock('./../../../src/messages/fetchWhitelistedEmotes')

describe('emoteUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('print correct output to the console', async () => {
    const whitelistChannels = ['123321']
    const emoteArray1 = [1]
    const emoteArray2 = [2]
    const emoteArrayCombined = [...emoteArray1, ...emoteArray2]

    const fetchEmotesMock = mocked(fetchEmotes, true)
    fetchEmotesMock.mockImplementation(() => {
      return new Promise((resolve) => resolve(emoteArray1))
    })

    const fetchWhitelistedEmotesMock = mocked(fetchWhitelistedEmotes, true)
    fetchWhitelistedEmotesMock.mockImplementation(() => {
      return new Promise((resolve) => resolve(emoteArray2))
    })

    const result = await getAllowedEmotes(whitelistChannels)

    expect(fetchEmotesMock).toBeCalledTimes(1)
    expect(fetchEmotesMock).toBeCalledWith(globalChannel)

    expect(fetchWhitelistedEmotesMock).toBeCalledTimes(1)
    expect(fetchWhitelistedEmotesMock).toBeCalledWith(whitelistChannels)

    expect(result).toStrictEqual(emoteArrayCombined)
  })
})

describe('hasSubEmotes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns false for empty emoteCodes array', () => {
    const allowedEmotes = [123, 456]
    const emoteCodes: number[] = []

    const result = hasSubEmotes(allowedEmotes, emoteCodes)

    expect(result).toStrictEqual(false)
  })

  test('returns false for intersecting emote codes', () => {
    const allowedEmotes = [123, 456]
    const emoteCodes = [123]

    const result = hasSubEmotes(allowedEmotes, emoteCodes)

    expect(result).toStrictEqual(false)
  })

  test('print correct output to the console', () => {
    const allowedEmotes = [123, 456]
    const emoteCodes = [789]

    const result = hasSubEmotes(allowedEmotes, emoteCodes)

    expect(result).toStrictEqual(true)
  })
})
