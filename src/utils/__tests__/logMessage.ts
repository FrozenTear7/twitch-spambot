import { logMessage } from '../logMessage'
import MockDate from 'mockdate'
import config from '../../config'

jest.mock('../../../src/config', () => ({ channelName: jest.fn() }))

jest.mock('colors', () => ({
  green: jest.fn((msg: string) => msg),
  yellow: jest.fn((msg: string) => msg),
}))

describe('logMessage', () => {
  test('print correct output to the console', () => {
    const channelName = 'testChannel'
    const msg = 'test message'
    const currentDate = new Date('January 1, 2020 12:00:00')
    const currentDateFormatted = currentDate.toLocaleTimeString('pl-PL')

    config.channelName = channelName
    const logSpy = jest.spyOn(global.console, 'log')
    MockDate.set(currentDate)

    let score = 1.11
    logMessage(msg, score)

    expect(logSpy).toBeCalledWith(
      `[${currentDateFormatted}, #${channelName}, score:   ${score.toFixed(
        2
      )}]: ${msg}`
    )

    score = 11.1
    logMessage(msg, score)

    expect(logSpy).toBeCalledWith(
      `[${currentDateFormatted}, #${channelName}, score:  ${score.toFixed(
        2
      )}]: ${msg}`
    )

    score = 111
    logMessage(msg, score)

    expect(logSpy).toBeCalledWith(
      `[${currentDateFormatted}, #${channelName}, score: ${score.toFixed(
        2
      )}]: ${msg}`
    )

    score = 1111
    logMessage(msg, score)

    expect(logSpy).toBeCalledWith(
      `[${currentDateFormatted}, #${channelName}, score: ${score.toFixed(
        1
      )}]: ${msg}`
    )

    expect(logSpy).toBeCalledTimes(4)
  })
})
