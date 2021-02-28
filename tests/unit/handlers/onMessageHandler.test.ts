import { sayInChannel } from './../../../src/messages/sayInChannel'
import { ChatUserstate } from 'tmi.js'
import config from '../../../src/config'
import { onMessageHandler } from './../../../src/handlers/onMessageHandler'

jest.useFakeTimers()

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

jest.mock('./../../../src/utils/logMessage')

jest.mock('./../../../src/utils/calculateScore')

jest.mock('./../../../src/messages/checkIgnoredMessage', () => ({
  checkIgnoredMessage: jest.fn(() => false),
}))

jest.mock('./../../../src/utils/postingCooldown', () => ({
  postingCooldown: jest.fn(() => true),
}))

jest.mock('./../../../src/messages/emoteUtils', () => ({
  hasSubEmotes: jest.fn(() => false),
}))

describe('onMessageHandler', () => {
  //   beforeEach(() => {
  //     jest.resetAllMocks()
  //   })

  const target = 'targetChannel'
  const author = 'test author'
  const context: ChatUserstate = {
    'message-type': 'chat',
    username: author,
  }
  config.sleepInterval = 1
  config.messageScore = 0.1
  config.TWITCH_USERNAME = 'testUsername'

  test('correctly skips self messages', () => {
    const msg = `test message @${config.TWITCH_USERNAME}`

    onMessageHandler(target, context, msg, true)

    expect(sayInChannel).toBeCalledTimes(0)
  })

  test('correctly skips auto-response', () => {
    config.mentionResponse = 0
    let msg = `test2 message @${config.TWITCH_USERNAME}`

    onMessageHandler(target, context, msg, false)

    config.mentionResponse = 1
    msg = `test2 message`

    onMessageHandler(target, context, msg, false)

    expect(setTimeout).toBeCalledTimes(0)
    expect(setTimeout).not.toBeCalledWith(
      expect.any(Function),
      expect.any(Number)
    )
    expect(sayInChannel).toBeCalledTimes(0)
    expect(sayInChannel).not.toBeCalledWith(`@${author} ConcernDoge 👌`)
  })

  test('correctly auto-responds', () => {
    config.mentionResponse = 1
    const msg = `test3 message @${config.TWITCH_USERNAME}`

    onMessageHandler(target, context, msg, false)

    expect(setTimeout).toBeCalledTimes(1)
    expect(setTimeout).toBeCalledWith(expect.any(Function), expect.any(Number))

    jest.runOnlyPendingTimers()

    expect(sayInChannel).toBeCalledTimes(1)
    expect(sayInChannel).toBeCalledWith(`@${author} ConcernDoge 👌`)
  })

  //   test('posts a message above the score threshold', () => {
  //     const msg = 'test chat message'
  //     const calculateScoreValueMock = 5

  //     const calculateScoreMock = mocked(calculateScore, true)
  //     calculateScoreMock.mockImplementation(() => calculateScoreValueMock)

  //     onMessageHandler(target, context, msg, false)

  //     expect(logMessage).toBeCalledTimes(1)
  //     expect(logMessage).toBeCalledWith(msg, calculateScoreValueMock)

  //     expect(sayInChannel).toBeCalledTimes(1)
  //     expect(sayInChannel).toBeCalledWith(msg)
  //   })

  //   test('posts an /action message', () => {
  //     context['message-type'] = 'action'
  //     const msg = 'test action message'
  //     const calculateScoreValueMock = 10

  //     const calculateScoreMock = mocked(calculateScore, true)
  //     calculateScoreMock.mockImplementation(() => calculateScoreValueMock)

  //     onMessageHandler(target, context, msg, false)

  //     expect(logMessage).toBeCalledTimes(1)
  //     expect(logMessage).toBeCalledWith(msg, calculateScoreValueMock)

  //     expect(sayInChannel).toBeCalledTimes(1)
  //     expect(sayInChannel).toBeCalledWith(`/me ${msg}`)
  //   })

  //   test('correctly posts a message if passed threshold', () => {
  //     const author = 'test author'
  //     const context: ChatUserstate = {
  //       'message-type': 'chat',
  //       username: author,
  //       emotes: {},
  //     }
  //     const self = false
  //     const msg = 'test message'

  //     onMessageHandler(target, context, msg, self)

  //     expect(setTimeout).toBeCalledTimes(1)
  //     expect(setTimeout).toBeCalledWith(expect.any(Function), expect.any(Number))
  //     jest.runOnlyPendingTimers()
  //     expect(sayInChannel).toBeCalledTimes(1)
  //     expect(sayInChannel).toBeCalledWith(`@${author} ConcernDoge 👌`)
  //   })
})
