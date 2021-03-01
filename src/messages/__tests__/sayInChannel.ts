import { client } from '../../index'
import { sayInChannel } from '../sayInChannel'
import config from '../../config'

jest.mock('./../../../src/index', () => ({
  client: {
    say: jest.fn(),
  },
}))

jest.mock('../../../src/config', () => ({ channelName: jest.fn() }))

jest.mock('colors', () => ({
  red: jest.fn((msg: string) => msg),
}))

describe('sayInChannel', () => {
  const channelName = 'testChannel'

  test('prints correct output to the console', async () => {
    const msg = 'test message'

    config.channelName = channelName
    const clientSaySpy = jest.spyOn(client, 'say')

    await sayInChannel(msg)

    expect(clientSaySpy).toBeCalledTimes(1)
    expect(clientSaySpy).toBeCalledWith(channelName, msg)
  })

  test('properly handles the error', async () => {
    const msg = 'test message'
    const errorMsg = 'errorMock'
    const invalidErrorMsg = 1

    config.channelName = channelName
    const logSpy = jest.spyOn(global.console, 'log')
    const clientSaySpy = jest.spyOn(client, 'say').mockImplementation(() => {
      throw new Error(errorMsg)
    })

    await sayInChannel(msg)

    expect(logSpy).toBeCalledWith(
      `Exception while printing to the channel: ${errorMsg}`
    )

    clientSaySpy.mockImplementation(() => {
      throw errorMsg
    })

    await sayInChannel(msg)

    clientSaySpy.mockImplementation(() => {
      throw invalidErrorMsg // Throw something else than Error or string
    })

    try {
      expect(await sayInChannel(msg)).toThrow()
    } catch (e) {
      expect(e).toBe(invalidErrorMsg)
    }

    expect(logSpy).toBeCalledTimes(2)
    expect(logSpy).toBeCalledWith(
      `Exception while printing to the channel: ${errorMsg}`
    )
    expect(logSpy).not.toBeCalledWith(
      `Exception while printing to the channel: ${invalidErrorMsg}`
    )
  })
})
