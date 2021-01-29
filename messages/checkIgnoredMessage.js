import ignoredWordsJson from '../config/ignoredWords.json'

const ignoreCharacters = ['!', '@', '#', '$', '%', '^', '&', '*'] // Ignore commands, whispers, etc.
const multispamRegex = /^.+ (\d+|\d+\/\d+)\s*$/gi // For things like copypastas with counters 'copypasta 1', 'copypasta 2' or 'copypasta 2/5'

export const checkIgnoredMessage = (authorsSeen, msg) => {
  const multispamRegexp = new RegExp(multispamRegex)

  // Skip commands, user whispers and messages containing ignored words from ./config/ignoredWords.json
  return (
    ignoreCharacters.includes(msg[0]) ||
    ignoredWordsJson.ignoredWords.some((substring) =>
      msg.includes(substring)
    ) ||
    authorsSeen.some((author) => msg.includes(author)) ||
    (msg.match(multispamRegexp) || []).length > 0
  )
}
