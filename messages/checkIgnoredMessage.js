import ignoredWordsJson from '../config/ignoredWords.json'

const ignoreCharacters = ['!', '@', '#', '$', '%', '^', '&', '*'] // Ignore commands, whispers, etc.

export const checkIgnoredMessage = (authorsSeen, msg) => {
  // Skip commands, user whispers and messages containing ignored words from ./config/ignoredWords.json
  return (
    ignoreCharacters.includes(msg[0]) ||
    ignoredWordsJson.ignoredWords.some((substring) =>
      msg.includes(substring)
    ) ||
    authorsSeen.some((author) => msg.includes(author))
  )
}
