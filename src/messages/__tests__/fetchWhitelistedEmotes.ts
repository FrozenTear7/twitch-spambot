import { mocked } from 'ts-jest/utils'
import { fetchWhitelistedEmotes } from '../fetchWhitelistedEmotes'
import { fetchChannelEmotes } from '../fetchEmotes'

jest.mock('../../../src/messages/fetchEmotes')

describe('fetchWhitelistedEmotes', () => {
  test('returns empty result for no channels', async () => {
    const channels: string[] = []
    const expectedResult: string[] = []

    const result = await fetchWhitelistedEmotes(channels)

    expect(result).toStrictEqual(expectedResult)
  })

  test('returns valid emotes for existing channels', async () => {
    const channels = ['123456']
    const channelEmotesMockData = ['123', '456']

    const fetchEmotesMock = mocked(fetchChannelEmotes, true)
    fetchEmotesMock.mockImplementation(() => {
      return new Promise((resolve) => resolve(channelEmotesMockData))
    })

    const result = await fetchWhitelistedEmotes(channels)
    expect(result).toStrictEqual(channelEmotesMockData)
  })
})
