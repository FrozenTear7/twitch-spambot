import { handleCatch } from './../../utils/handleCatch'
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

jest.mock('./../../utils/handleCatch', () => ({
  handleCatch: jest.fn(),
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
    const clientSayError = new Error('errorMock')

    config.channelName = channelName
    jest.spyOn(global.console, 'log')
    jest.spyOn(client, 'say').mockImplementation(() => {
      throw clientSayError
    })

    await sayInChannel(msg)

    expect(handleCatch).toBeCalledTimes(1)
    expect(handleCatch).toBeCalledWith(
      'Exception while printing to the channel',
      clientSayError
    )
  })
})
