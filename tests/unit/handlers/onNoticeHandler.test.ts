import { onNoticeHandler } from './../../../src/handlers/onNoticeHandler'

describe('onNoticeHandler', () => {
  const channel = 'test'
  const noticeMsg = 'test'

  test('handles inability to post', () => {
    const exitMsg = 'mock process.exit(0)'
    const logSpy = jest.spyOn(global.console, 'log')
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error(exitMsg)
    })

    const valuesToTest = [
      'msg_channel_suspended',
      'msg_banned',
      'msg_followersonly',
    ]

    valuesToTest.forEach((valueToTest) => {
      try {
        onNoticeHandler(channel, valueToTest, noticeMsg)
      } catch (e) {
        expect((e as Error).message).toBe(exitMsg)
      }

      expect(logSpy).toBeCalledWith(`Received notice: ${valueToTest}`)
      expect(logSpy).toBeCalledWith(`Exception during execution: ${noticeMsg}`)
      expect(exitSpy).toBeCalledWith(0)
    })

    expect(logSpy).toBeCalledTimes(2 * valuesToTest.length)
    expect(exitSpy).toBeCalledTimes(1 * valuesToTest.length)
  })

  test('posting obstructed', () => {
    const logSpy = jest.spyOn(global.console, 'log')

    const valuesToTest = [
      'msg_timedout',
      'msg_ratelimit',
      'msg_duplicate',
      'msg_subsonly',
    ]

    valuesToTest.forEach((valueToTest) => {
      onNoticeHandler(channel, valueToTest, noticeMsg)

      expect(logSpy).toBeCalledWith(`Received notice: ${valueToTest}`)
      expect(logSpy).toBeCalledWith(noticeMsg)
    })

    expect(logSpy).toBeCalledTimes(2 * valuesToTest.length)
  })

  test('host offline', () => {
    const noticeType = 'host_target_went_offline'

    const exitMsg = 'mock process.exit(0)'
    const logSpy = jest.spyOn(global.console, 'log')
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error(exitMsg)
    })

    try {
      onNoticeHandler(channel, noticeType, noticeMsg)
    } catch (e) {
      expect((e as Error).message).toBe(exitMsg)
    }

    expect(logSpy).toBeCalledTimes(2)
    expect(logSpy).toBeCalledWith(`Received notice: ${noticeType}`)
    expect(logSpy).toBeCalledWith('Stream ended, stopping the spam')

    expect(exitSpy).toBeCalledTimes(1)
    expect(exitSpy).toBeCalledWith(0)
  })

  test('different_notice', () => {
    const noticeType = 'different_notice'

    const logSpy = jest.spyOn(global.console, 'log')

    onNoticeHandler(channel, noticeType, noticeMsg)

    expect(logSpy).toBeCalledTimes(3)
    expect(logSpy).toBeCalledWith(`Received notice: ${noticeType}`)
    expect(logSpy).toBeCalledWith(
      `Unhandled notice of type: ${noticeType} - ${noticeMsg}`
    )
    expect(logSpy).toBeCalledWith(
      'Address this in the Issues on Github if something important breaks here'
    )
  })
})
