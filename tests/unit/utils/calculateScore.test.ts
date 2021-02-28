import { MessageData } from './../../../src/types'
import { getBaseSpam } from './../../../src/messages/spamUtils'
import { calculateScore } from './../../../src/utils/calculateScore'
import stringSimilarity from 'string-similarity'

jest.mock('./../../../src/messages/spamUtils', () => ({
  getBaseSpam: jest.fn().mockReturnValue('getBaseSpam test'),
}))

describe('calculateScore', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('returns valid score for existing currentMessages', () => {
    const msg = 'test'
    const currentMessages: MessageData[] = [
      {
        message: 'test2',
        messageType: 'chat',
        timestamp: Math.floor(Date.now()),
        emoteCodes: [1, 2, 3],
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

  test('returns valid score for non-existing currentMessages', () => {
    const msg = 'test'
    const currentMessages: MessageData[] = []

    const result = calculateScore(msg, currentMessages)

    expect(result).toBe(0)
  })
})
