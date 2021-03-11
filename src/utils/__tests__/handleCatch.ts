import { handleCatch } from './../handleCatch'

jest.mock('colors', () => ({
  red: jest.fn((msg: string) => msg),
}))

describe('handleCatch', () => {
  test('handles an Error correctly', () => {
    const logMsg = 'test'
    const testErrorMsg = 'test message'
    const testError = new Error(testErrorMsg)

    const logSpy = jest.spyOn(global.console, 'log')

    handleCatch(logMsg, testError)

    expect(logSpy).toBeCalledTimes(1)
    expect(logSpy).toBeCalledWith(`${logMsg}: ${testErrorMsg}`)
  })

  test('handles an string correctly', () => {
    const logMsg = 'test'
    const testErrorMsg = 'test message'

    const logSpy = jest.spyOn(global.console, 'log')

    handleCatch(logMsg, testErrorMsg)

    expect(logSpy).toBeCalledTimes(1)
    expect(logSpy).toBeCalledWith(`${logMsg}: ${testErrorMsg}`)
  })

  test('rethrows anything else', () => {
    const logMsg = 'test'
    const otherError = undefined

    const logSpy = jest.spyOn(global.console, 'log')

    try {
      expect(handleCatch(logMsg, otherError)).toThrowError(otherError)
    } catch (_e) {
      expect(logSpy).toBeCalledTimes(0)
    }
  })
})
