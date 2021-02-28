/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { mocked } from 'ts-jest/utils'
import { getAllowedEmotes } from '../../src/messages/emoteUtils'
import whitelistEmotes from '../../config/whitelistEmotes.json'

jest.mock('tmi.js')

jest.mock('./../../config/whitelistEmotes.json', () => ({
  channels: ['123321'],
}))

jest.mock('./../../src/messages/emoteUtils')

describe('index', () => {
  test('exports a valid client and allowedEmotes', () => {
    const allowedEmotesDataMock = [123, 456]

    const logSpy = jest.spyOn(global.console, 'log')
    const getAllowedEmotesMock = mocked(getAllowedEmotes, true)
    getAllowedEmotesMock.mockImplementation(() => {
      return new Promise((resolve) => resolve(allowedEmotesDataMock))
    })

    require('../../src/index')

    expect(logSpy).toBeCalledTimes(3)
    expect(logSpy).toBeCalledWith('Fetching all global emotes')
    expect(logSpy).toBeCalledWith('Finished fetching global emotes')
    expect(logSpy).toBeCalledWith(
      expect.stringMatching(/\* Connected to irc-ws\.chat\.twitch\.tv:\d+/)
    )
    expect(logSpy).toBeCalledWith('Starting the bot')

    expect(getAllowedEmotesMock).toBeCalledTimes(1)
    expect(getAllowedEmotesMock).toBeCalledWith(whitelistEmotes.channels)
  })
})
