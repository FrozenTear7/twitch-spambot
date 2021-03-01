import { mapMessageToScore } from './../mapMessageToScore'
import { MessageData } from './../../types'
import { calculateScore } from './../calculateScore'
import { mocked } from 'ts-jest/utils'

jest.mock('./../calculateScore')

describe('mapMessageToScore', () => {
  test('returns valid score', () => {
    const msg = 'test'
    const currentMessages: MessageData[] = [
      {
        message: 'test',
        messageType: 'chat',
        timestamp: Date.now(),
        emoteCodes: [1],
      },
    ]
    const scoreDataMock = 1

    const calculateScoreMock = mocked(calculateScore, true)
    calculateScoreMock.mockReturnValue(scoreDataMock)

    const result = mapMessageToScore(msg, currentMessages)

    expect(result).toStrictEqual({
      message: msg,
      score: scoreDataMock,
    })
  })
})
