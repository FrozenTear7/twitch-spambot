import { MessageData } from '../../types'
import { getBaseSpam } from '../../messages/spamUtils'
import { calculateScore } from '../calculateScore'
import stringSimilarity from 'string-similarity'

jest.mock('./../../../src/messages/spamUtils', () => ({
  getBaseSpam: jest.fn().mockReturnValue('getBaseSpam test'),
}))

describe('calculateScore', () => {
  test('returns valid score for existing currentMessages', () => {
    const msg = 'test'
    const currentMessages: MessageData[] = [
      {
        message: 'test2',
        messageType: 'chat',
        timestamp: Math.floor(Date.now()),
        emoteCodes: ['1', '2', '3'],
      },
    ]

    const compareTwoStringsMock = (stringSimilarity.compareTwoStrings = jest
      .fn()
      .mockReturnValueOnce(0.25)
      .mockReturnValueOnce(0.5))

    let result = calculateScore(msg, currentMessages)

    expect(getBaseSpam).toBeCalledTimes(1)
    expect(getBaseSpam).toBeCalledWith(currentMessages[0].message)

    expect(compareTwoStringsMock).toBeCalledTimes(2)
    expect(compareTwoStringsMock).toBeCalledWith(
      currentMessages[0].message,
      msg
    )
    expect(compareTwoStringsMock).toBeCalledWith('getBaseSpam test', msg)

    expect(result).toBe(0.5)

    // Now check if similarity > baseSpamSimilarity will return properly

    compareTwoStringsMock.mockReset()
    compareTwoStringsMock.mockReturnValueOnce(0.5).mockReturnValueOnce(0.25)

    result = calculateScore(msg, currentMessages)

    expect(result).toBe(0.5)
  })

  test('add double the score for identical messages', () => {
    const msg = 'test'
    const currentMessages: MessageData[] = [
      {
        message: msg,
        messageType: 'chat',
        timestamp: Math.floor(Date.now()),
        emoteCodes: ['1', '2', '3'],
      },
    ]

    const result = calculateScore(msg, currentMessages)

    expect(getBaseSpam).toBeCalledTimes(1)
    expect(getBaseSpam).toBeCalledWith(currentMessages[0].message)

    expect(result).toBe(2.0)
  })

  test('returns valid score for non-existing currentMessages', () => {
    const msg = 'test'
    const currentMessages: MessageData[] = []

    const result = calculateScore(msg, currentMessages)

    expect(result).toBe(0)
  })
})
