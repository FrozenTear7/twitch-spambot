import { client } from '../../index'
import { sayInChannel } from '../sayInChannel'
import config from '../../config'

jest.mock('./../../../src/index', () => ({
  client: {
    say: jest.fn(),
  },
}))
jest.mock('../../../src/config', () => ({ channelName: jest.fn() }))

describe('sayInChannel', () => {
  const channelName = 'testChannel'

  test('prints correct output to the console', async () => {
    const msg = 'test message'

    config.channelName = channelName
    client.say = jest.fn().mockImplementation(
      () => new Promise<void>((resolve) => resolve())
    )
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { say: sayMock } = client

    await sayInChannel(msg)

    expect(sayMock).toBeCalledTimes(1)
    expect(sayMock).toBeCalledWith(channelName, msg)
  })

  test('properly handles the error', async () => {
    const msg = 'test message'
    const errorMsg = 'errorMock'

    config.channelName = channelName
    const logSpy = jest.spyOn(global.console, 'log')
    client.say = jest.fn().mockImplementation(() => {
      throw new Error(errorMsg)
    })

    await sayInChannel(msg)

    expect(logSpy).toBeCalledTimes(1)
    expect(logSpy).toBeCalledWith(
      `Exception while printing to the channel: ${errorMsg}`
    )
  })
})