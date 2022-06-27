import { mocked } from 'ts-jest/utils'
import { fetchChannelEmotes, fetchGlobalEmotes } from '../fetchEmotes'
import { ChannelInfo, Emote } from '../../types'
import toChannelInfo from '../../utils/parseTypes/toChannelInfo'
import axios from 'axios'

jest.mock('axios')
jest.mock('../../../src/utils/parseTypes/toChannelInfo')

describe('fetchGlobalEmotes', () => {
  test('returns emotes correctly', async () => {
    const resMock = { data: 'dataMock' }
    const emotesMock = [
      {
        id: '1',
        name: 'test',
      },
    ]

    const axiosGetSpy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => resolve(resMock))
    })

    const toChannelInfoMock = mocked(toChannelInfo, true)
    toChannelInfoMock.mockImplementation(
      (): ChannelInfo => ({
        data: emotesMock,
      })
    )

    const result = await fetchGlobalEmotes()

    expect(axiosGetSpy).toBeCalledTimes(1)

    expect(toChannelInfoMock).toBeCalledTimes(1)
    expect(toChannelInfoMock).toBeCalledWith(resMock.data)

    expect(result).toStrictEqual(emotesMock.map((emote: Emote) => emote.id))
  })

  test("throws an error if res.data doesn't exist", async () => {
    const resMock = {}
    const emotesMock = [
      {
        id: '1',
        name: 'test',
      },
    ]

    const axiosGetSpy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => resolve(resMock))
    })

    const toChannelInfoMock = mocked(toChannelInfo, true)
    toChannelInfoMock.mockImplementation(
      (): ChannelInfo => ({
        data: emotesMock,
      })
    )

    try {
      expect(await fetchGlobalEmotes()).toThrow()
    } catch (e) {
      expect((e as Error).message).toBe('Could not fetch global emotes')
    }

    expect(axiosGetSpy).toBeCalledTimes(1)

    expect(toChannelInfoMock).toBeCalledTimes(0)
  })
})

describe('fetchChannelEmotes', () => {
  test('returns emotes correctly', async () => {
    const channelId = '0'
    const resMock = { data: 'dataMock' }
    const emotesMock = [
      {
        id: '1',
        name: 'test',
      },
    ]

    const axiosGetSpy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => resolve(resMock))
    })

    const toChannelInfoMock = mocked(toChannelInfo, true)
    toChannelInfoMock.mockImplementation(
      (): ChannelInfo => ({
        data: emotesMock,
      })
    )

    const result = await fetchChannelEmotes(channelId)

    expect(axiosGetSpy).toBeCalledTimes(1)

    expect(toChannelInfoMock).toBeCalledTimes(1)
    expect(toChannelInfoMock).toBeCalledWith(resMock.data)

    expect(result).toStrictEqual(emotesMock.map((emote: Emote) => emote.id))
  })

  test("throws an error if res.data doesn't exist", async () => {
    const channelId = '0'
    const resMock = {}
    const emotesMock = [
      {
        id: '1',
        name: 'test',
      },
    ]

    const axiosGetSpy = jest.spyOn(axios, 'get').mockImplementation(() => {
      return new Promise((resolve) => resolve(resMock))
    })

    const toChannelInfoMock = mocked(toChannelInfo, true)
    toChannelInfoMock.mockImplementation(
      (): ChannelInfo => ({
        data: emotesMock,
      })
    )

    try {
      expect(await fetchChannelEmotes(channelId)).toThrow()
    } catch (e) {
      expect((e as Error).message).toBe(
        `Could not fetch emotes for channel: ${channelId}`
      )
    }

    expect(axiosGetSpy).toBeCalledTimes(1)

    expect(toChannelInfoMock).toBeCalledTimes(0)
  })
})
