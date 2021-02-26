import { logMessage } from './../../../src/utils/logMessage'
import MockDate from 'mockdate'

const channelName = 'test'
jest.mock('./../../../src/config', () => ({ channelName: channelName }))

describe('logMessage', () => {
  test('print correct output to the console', () => {
    const msg = 'test message'
    const score = 10
    const currentDate = new Date('January 1, 2020 12:00:00')
    const currentDateFormatted = currentDate.toLocaleTimeString('pl-PL')

    console.log = jest.fn()
    MockDate.set(currentDate)

    logMessage(msg, score)

    expect(console.log).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledTimes(1)
    expect(console.log).toHaveBeenCalledWith(
      `[${currentDateFormatted}, #${channelName}, score: ${score.toFixed(
        2
      )}]: ${msg}`
    )
  })
})
