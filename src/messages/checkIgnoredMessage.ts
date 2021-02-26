import { ignoreCharacters, multispamRegex } from './../utils/constants'
import ignoredWordsJson from '../../config/ignoredWords.json'

export const checkIgnoredMessage = (
  authorsSeen: string[],
  msg: string
): boolean => {
  const multispamRegexp = new RegExp(multispamRegex)

  // Skip commands, user whispers and messages containing ignored words from ./config/ignoredWords.json
  return (
    ignoreCharacters.includes(msg[0]) || // Check for bot commands
    ignoredWordsJson.ignoredWords.some((substring) =>
      msg.includes(substring)
    ) ||
    // Convert the username and the message to lowercase since for example Chatterino autocompletes username in lowercase
    authorsSeen.some((author) =>
      msg.toLowerCase().includes(author.toLowerCase())
    ) ||
    (multispamRegexp.exec(msg) || []).length > 0
  )
}
