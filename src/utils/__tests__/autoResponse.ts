import { mocked } from 'ts-jest/utils'
import { sayInChannel } from '../../messages/sayInChannel'
import { autoResponse } from '../autoResponse'
import config from '../../config'

jest.useFakeTimers()

jest.mock('../../config', () => ({ mentionResponse: jest.fn() }))
jest.mock('../../config')
jest.mock('../../messages/sayInChannel')
jest.mock('../../index', () => ({ client: jest.fn() }))

describe('autoResponse', () => {
  test("don't respond if disabled", () => {
    const msg = 'test'
    const author = 'test'
    config.mentionResponse = 0

    const sayInChannelMock = mocked(sayInChannel, true)

    void autoResponse(msg, author)

    expect(sayInChannelMock).toBeCalledTimes(0)
  })

  test("don't respond if author doesn't exist or message has no mention", () => {
    const msg = 'test'
    const author = 'test'
    config.mentionResponse = 1
    config.TWITCH_USERNAME = 'testUsername'

    const sayInChannelMock = mocked(sayInChannel, true)

    void autoResponse(msg, author)
    void autoResponse(msg, undefined)

    expect(sayInChannelMock).toBeCalledTimes(0)
  })

  test('respond feature enabled and message has a mention', () => {
    const author = 'test'
    config.mentionResponse = 1
    config.TWITCH_USERNAME = 'testUsername'
    const msg = `hey ${config.TWITCH_USERNAME}`

    const sayInChannelMock = mocked(sayInChannel, true)

    void autoResponse(msg, author)

    expect(sayInChannelMock).toBeCalledTimes(1)
    expect(sayInChannelMock).toBeCalledWith(`@${author} ConcernDoge 👌`)
    jest.runOnlyPendingTimers()
  })
})
