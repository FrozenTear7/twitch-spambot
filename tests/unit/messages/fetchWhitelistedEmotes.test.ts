import { fetchEmotes } from './../../../src/messages/fetchEmotes'
import { fetchWhitelistedEmotes } from './../../../src/messages/fetchWhitelistedEmotes'
import { mocked } from 'ts-jest/utils'

jest.mock('../../../src/messages/fetchEmotes')

describe('fetchWhitelistedEmotes', () => {
  test('returns empty result for no channels', async () => {
    const channels: string[] = []
    const expectedResult: number[] = []

    const result = await fetchWhitelistedEmotes(channels)

    expect(result).toStrictEqual(expectedResult)
  })

  test('returns valid emotes for existing channels', async () => {
    const channels: string[] = ['123456']
    const channelEmotesMockData = [123, 456]

    const fetchEmotesMock = mocked(fetchEmotes, true)
    fetchEmotesMock.mockImplementation(() => {
      return new Promise((resolve) => resolve(channelEmotesMockData))
    })

    const result = await fetchWhitelistedEmotes(channels)
    expect(result).toStrictEqual(channelEmotesMockData)
  })
})
