import { logMessage } from './../../utils/logMessage'
import { handleCatch } from './../../utils/handleCatch'
import { client } from '../../index'
import { sayInChannel } from '../sayInChannel'
import config from '../../config'
import MockDate from 'mockdate'

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

jest.mock('./../../utils/logMessage', () => ({
  logMessage: jest.fn(),
}))

describe('sayInChannel', () => {
  const channelName = 'testChannel'

  test('correctly autoresponds', async () => {
    const msg = 'autoresponse test'

    config.channelName = channelName
    config.sleepInterval = 0
    const clientSaySpy = jest.spyOn(client, 'say')

    await sayInChannel(msg)

    expect(clientSaySpy).toBeCalledTimes(1)
    expect(clientSaySpy).toBeCalledWith(channelName, msg)
  })

  test('prints correct output to the console', async () => {
    const msg = 'test message'
    const score = 2
    const messageType = 'chat'
    config.channelName = channelName
    config.sleepInterval = 0

    const clientSaySpy = jest.spyOn(client, 'say')

    MockDate.set(new Date('January 1, 2020 12:00:00'))

    await sayInChannel(msg, score, messageType)

    MockDate.set(new Date('January 1, 2020 13:00:00'))

    await sayInChannel(msg, score, messageType)

    expect(logMessage).toBeCalledTimes(2)
    expect(logMessage).toBeCalledWith(msg, score)

    expect(clientSaySpy).toBeCalledTimes(2)
    expect(clientSaySpy).toBeCalledWith(channelName, msg)
    expect(clientSaySpy).toBeCalledWith(channelName, msg + ' 󠀀')
  })

  test('prints action message correctly to the console', async () => {
    const msg = 'test message'
    const score = 2
    const messageType = 'action'
    config.channelName = channelName
    config.sleepInterval = 0

    const clientSaySpy = jest.spyOn(client, 'say')

    MockDate.set(new Date('January 1, 2020 14:00:00'))

    await sayInChannel(msg, score, messageType)

    expect(logMessage).toBeCalledTimes(1)
    expect(logMessage).toBeCalledWith(msg, score)

    expect(clientSaySpy).toBeCalledTimes(1)
    expect(clientSaySpy).toBeCalledWith(channelName, `/me ${msg}`)
  })

  test('properly handles the error', async () => {
    const msg = 'test message'
    const score = 2
    const messageType = 'chat'
    config.channelName = channelName
    config.sleepInterval = 0

    const clientSayError = new Error('errorMock')

    MockDate.set(new Date('January 1, 2020 15:00:00'))

    config.channelName = channelName
    jest.spyOn(global.console, 'log')
    jest.spyOn(client, 'say').mockImplementation(() => {
      throw clientSayError
    })

    await sayInChannel(msg, score, messageType)

    expect(handleCatch).toBeCalledTimes(1)
    expect(handleCatch).toBeCalledWith(
      'Exception while printing to the channel',
      clientSayError
    )
  })
})
