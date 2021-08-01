import { allowedEmotes } from './../../index'
import { hasSubEmotes } from './../../messages/emoteUtils'
import { mapMessageToScore } from './../../utils/mapMessageToScore'
import { mocked } from 'ts-jest/utils'
import { autoResponse } from './../../utils/autoResponse'
import { sayInChannel } from '../../messages/sayInChannel'
import { ChatUserstate } from 'tmi.js'
import config from '../../config'
import { onMessageHandler } from '../onMessageHandler'

jest.mock('../../../src/config', () => ({
  mentionResponse: jest.fn(),
  TWITCH_USERNAME: jest.fn(),
}))

jest.mock('./../../../src/index', () => ({
  allowedEmotes: [],
}))

jest.mock('./../../../src/messages/sayInChannel', () => ({
  sayInChannel: jest.fn(),
}))

jest.mock('./../../../src/utils/mapMessageToScore')

jest.mock('./../../../src/messages/checkIgnoredMessage', () => ({
  checkIgnoredMessage: jest.fn(() => false),
}))

jest.mock('./../../../src/utils/postingCooldown', () => ({
  postingCooldown: jest.fn(() => true),
}))

jest.mock('./../../../src/messages/emoteUtils', () => ({
  hasSubEmotes: jest.fn(() => false),
}))

jest.mock('./../../../src/utils/autoResponse')

describe('onMessageHandler', () => {
  const target = 'targetChannel'
  const author = 'test author'
  const context: ChatUserstate = {
    'message-type': 'chat',
    username: author,
  }
  config.sleepInterval = 1
  config.messageScore = 0
  config.TWITCH_USERNAME = 'testUsername'

  test('chat message is posted normally', () => {
    const msg = 'chat message'
    const mapMessageToScoreValueMock = 1

    const mapMessageToScoreMock = mocked(mapMessageToScore, true)
    mapMessageToScoreMock.mockReturnValue({
      message: msg,
      score: mapMessageToScoreValueMock,
    })

    onMessageHandler(target, context, msg, false)

    expect(sayInChannel).toBeCalledTimes(1)
    expect(sayInChannel).toBeCalledWith(
      msg,
      mapMessageToScoreValueMock,
      context['message-type']
    )
  })

  test('action message is posted with /me', () => {
    const msg = 'action message'
    const mapMessageToScoreValueMock = 1

    const mapMessageToScoreMock = mocked(mapMessageToScore, true)
    mapMessageToScoreMock.mockReturnValue({
      message: msg,
      score: mapMessageToScoreValueMock,
    })

    onMessageHandler(
      target,
      { ...context, 'message-type': 'action', username: 'different author' },
      msg,
      false
    )

    expect(sayInChannel).toBeCalledTimes(1)
    expect(sayInChannel).toBeCalledWith(
      msg,
      mapMessageToScoreValueMock,
      'action'
    )
  })

  test('message not posted if below config.messageScore', () => {
    const msg = 'chat message'
    const mapMessageToScoreValueMock = 1
    config.messageScore = 10

    const mapMessageToScoreMock = mocked(mapMessageToScore, true)
    mapMessageToScoreMock.mockReturnValue({
      message: msg,
      score: mapMessageToScoreValueMock,
    })

    onMessageHandler(target, context, msg, false)

    expect(sayInChannel).toBeCalledTimes(0)
  })

  test('self message quits immediately', () => {
    const msg = 'test'

    onMessageHandler(target, context, msg, true)

    expect(autoResponse).toBeCalledTimes(0)
  })

  test('correctly calls autoResponse', () => {
    const msg = 'test'

    onMessageHandler(target, context, msg, false)

    expect(autoResponse).toBeCalledTimes(1)
    expect(autoResponse).toBeCalledWith(msg, author)
  })

  test("skips URLs and same author's messages", () => {
    const msgURL = 'https://www.youtube.com/'
    const msgSameAuthor = 'test'

    onMessageHandler(target, context, msgURL, false)
    onMessageHandler(target, context, msgSameAuthor, false)

    expect(sayInChannel).toBeCalledTimes(0)
  })

  test('properly calculates emoteCodes', () => {
    const msg = 'test'
    context.username = 'test new author'

    onMessageHandler(target, context, msg, false)

    expect(hasSubEmotes).toBeCalledWith(allowedEmotes, [])

    const emoteCode = '25'
    context.username = 'test new author2'
    context.emotes = { [`${emoteCode}`]: ['0-4'] }

    onMessageHandler(target, context, msg, false)

    expect(hasSubEmotes).toBeCalledWith(allowedEmotes, [emoteCode])
    expect(hasSubEmotes).toBeCalledTimes(2)
  })
})
