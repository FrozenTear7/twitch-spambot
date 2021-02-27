import { logMessage } from './../../../src/utils/logMessage'
import MockDate from 'mockdate'
import config from '../../../src/config'

jest.mock('../../../src/config', () => ({ channelName: jest.fn() }))

describe('logMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('print correct output to the console', () => {
    const channelName = 'testChannel'
    const msg = 'test message'
    const score = 10
    const currentDate = new Date('January 1, 2020 12:00:00')
    const currentDateFormatted = currentDate.toLocaleTimeString('pl-PL')

    config.channelName = channelName
    const logSpy = jest.spyOn(global.console, 'log')
    MockDate.set(currentDate)

    logMessage(msg, score)

    expect(logSpy).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenCalledWith(
      `[${currentDateFormatted}, #${channelName}, score: ${score.toFixed(
        2
      )}]: ${msg}`
    )
  })
})
