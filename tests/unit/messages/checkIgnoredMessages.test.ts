import { checkIgnoredMessage } from './../../../src/messages/checkIgnoredMessage'
import ignoredWordsJson from '../../../config/ignoredWords.json'

jest.mock('../../../config/ignoredWords.json')

describe('checkIgnoredMessage', () => {
  const authorsSeen = ['testAuthor']

  test('rejects a command message', () => {
    const msg = '!botcommand'

    expect(checkIgnoredMessage(authorsSeen, msg)).toBe(true)
  })

  test('rejects a message containing an ignored word', () => {
    const ignoredWord = 'ignoredWord'
    ignoredWordsJson.ignoredWords = [ignoredWord]
    const msg = `something ${ignoredWord} something2`

    expect(checkIgnoredMessage(authorsSeen, msg)).toBe(true)
  })

  test('rejects a message containing an existing author', () => {
    const msgNormal = `hey homie ${authorsSeen[0]}`
    const msgLower = `hey homie ${authorsSeen[0].toLowerCase()}`
    const msgUppwer = `hey homie ${authorsSeen[0].toUpperCase()}`
    const valuesToTest = [msgNormal, msgLower, msgUppwer]

    valuesToTest.forEach((valueToTest) =>
      expect(checkIgnoredMessage(authorsSeen, valueToTest)).toBe(true)
    )
  })

  test('rejects a multipasta (like PASTA 3, DAILY QUEST ZULUL 2/50)', () => {
    const msg = 'DAILY QUEST COPYPASTE THIS MESSAGE ZULUL 2/50'

    expect(checkIgnoredMessage(authorsSeen, msg)).toBe(true)
  })

  test('confirms a valid message', () => {
    const msg = 'test message'

    expect(checkIgnoredMessage(authorsSeen, msg)).toBe(false)
  })
})
