import { fetchEmotes } from './../../../src/messages/fetchEmotes'
import { emotesURI } from '../../../src/utils/constants'
import { mocked } from 'ts-jest/utils'
import { ChannelInfo, Emote } from '../../../src/types'
import toChannelInfo from '../../../src/utils/parseTypes/toChannelInfo'
import axios from 'axios'

jest.mock('axios')
jest.mock('../../../src/utils/parseTypes/toChannelInfo')

describe('fetchEmotes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns emotes correctly', async () => {
    const channelId = '0'
    const resMock = { data: 'dataMock' }
    const emotesMock = [
      {
        code: '1',
        emoticon_set: 1,
        id: 1,
      },
    ]

    const axiosGetSpy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => resolve(resMock))
    })

    const toChannelInfoMock = mocked(toChannelInfo, true)
    toChannelInfoMock.mockImplementation(
      (): ChannelInfo => ({
        emotes: emotesMock,
      })
    )

    const result = await fetchEmotes(channelId)

    expect(axiosGetSpy).toBeCalledTimes(1)
    expect(axiosGetSpy).toBeCalledWith(`${emotesURI}/${channelId}`)

    expect(toChannelInfoMock).toBeCalledTimes(1)
    expect(toChannelInfoMock).toBeCalledWith(resMock.data)

    expect(result).toStrictEqual(emotesMock.map((emote: Emote) => emote.id))
  })

  test("throws an error if res.data doesn't exist", async () => {
    const channelId = '0'
    const resMock = {}
    const emotesMock = [
      {
        code: '1',
        emoticon_set: 1,
        id: 1,
      },
    ]

    const axiosGetSpy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => resolve(resMock))
    })

    const toChannelInfoMock = mocked(toChannelInfo, true)
    toChannelInfoMock.mockImplementation(
      (): ChannelInfo => ({
        emotes: emotesMock,
      })
    )

    try {
      expect(await fetchEmotes(channelId)).toThrow()
    } catch (e) {
      expect((e as Error).message).toBe(
        `Could not fetch emotes for channel: ${channelId}`
      )
    }

    expect(axiosGetSpy).toBeCalledTimes(1)
    expect(axiosGetSpy).toBeCalledWith(`${emotesURI}/${channelId}`)
    expect(toChannelInfoMock).toBeCalledTimes(0)
  })
})
