/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
describe('config', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
  })

  test('exits on missing .env TWITCH_USERNAME and CLIENT_TOKEN', () => {
    const OLD_ENV = process.env
    process.env = { ...OLD_ENV }

    const exitMsg = 'mock process.exit(0)'
    const logSpy = jest.spyOn(global.console, 'log')
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error(exitMsg)
    })

    // TWITCH_USERNAME check

    process.env.TWITCH_USERNAME = undefined

    try {
      // Looks ridiculous, but I have no idea how to test it better
      require('../../src/config').default
    } catch (e) {
      expect((e as Error).message).toBe(exitMsg)
    }

    expect(logSpy).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenCalledWith('Please provide a valid .env config')

    expect(exitSpy).toHaveBeenCalledTimes(1)
    expect(exitSpy).toHaveBeenCalledWith(0)

    // CLIENT_TOKEN check

    process.env.TWITCH_USERNAME = 'TestUsername'
    process.env.CLIENT_TOKEN = undefined

    try {
      require('../../src/config').default
    } catch (e) {
      expect((e as Error).message).toBe(exitMsg)
    }

    expect(logSpy).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenCalledWith('Please provide a valid .env config')

    expect(exitSpy).toHaveBeenCalledTimes(1)
    expect(exitSpy).toHaveBeenCalledWith(0)

    process.env = OLD_ENV
  })

  test('returns valid config', () => {
    const channelName = 'testChannel'
    const readInterval = '5000'
    const sleepInterval = '35000'
    const messageScore = '3'
    const mentionResponse = '1'

    process.argv = [
      'test',
      'test',
      channelName,
      readInterval,
      sleepInterval,
      messageScore,
      mentionResponse,
    ]

    const config = require('../../src/config').default
    const clientOptionsCheck = {
      connection: {
        reconnect: true,
        secure: true,
      },
      identity: {
        username: process.env.TWITCH_USERNAME,
        password: process.env.CLIENT_TOKEN,
      },
      channels: [channelName],
    }
    const configCheck = {
      TWITCH_USERNAME: process.env.TWITCH_USERNAME,
      CLIENT_TOKEN: process.env.CLIENT_TOKEN,
      channelName,
      clientOptions: clientOptionsCheck,
      readInterval: +readInterval,
      sleepInterval: +sleepInterval,
      messageScore: +messageScore,
      mentionResponse: +mentionResponse,
    }

    expect(config).toStrictEqual(configCheck)
  })

  test('returns valid config with default values', () => {
    const channelName = 'testChannel'

    process.argv = ['test', 'test', channelName]

    const config = require('../../src/config').default
    const clientOptionsCheck = {
      connection: {
        reconnect: true,
        secure: true,
      },
      identity: {
        username: process.env.TWITCH_USERNAME,
        password: process.env.CLIENT_TOKEN,
      },
      channels: [channelName],
    }
    const configCheck = {
      TWITCH_USERNAME: process.env.TWITCH_USERNAME,
      CLIENT_TOKEN: process.env.CLIENT_TOKEN,
      channelName,
      clientOptions: clientOptionsCheck,
      readInterval: 3000,
      sleepInterval: 30000,
      messageScore: 4,
      mentionResponse: 0,
    }

    expect(config).toStrictEqual(configCheck)
  })

  test('exits on missing channelName', () => {
    const exitMsg = 'mock process.exit(0)'
    const logSpy = jest.spyOn(global.console, 'log')
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error(exitMsg)
    })

    process.argv = ['test', 'test']

    try {
      require('../../src/config').default
    } catch (e) {
      expect((e as Error).message).toBe(exitMsg)
    }

    expect(logSpy).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenCalledWith('Please provide a channel name')

    expect(exitSpy).toHaveBeenCalledTimes(1)
    expect(exitSpy).toHaveBeenCalledWith(0)
  })

  test('exits on missing channelName', () => {
    const exitMsg = 'mock process.exit(0)'
    const logSpy = jest.spyOn(global.console, 'log')
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error(exitMsg)
    })

    process.argv = ['test', 'test', 'testChannel', '-', '-', '-', '2']

    try {
      require('../../src/config').default
    } catch (e) {
      expect((e as Error).message).toBe(exitMsg)
    }

    expect(logSpy).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenCalledWith(
      'Please provide a valid mentionResponse value'
    )

    expect(exitSpy).toHaveBeenCalledTimes(1)
    expect(exitSpy).toHaveBeenCalledWith(0)
  })
})
