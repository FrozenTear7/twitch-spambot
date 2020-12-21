// Clean up the message from special characters before passing it to the RegExp
const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const getBaseSpam = (msg, spamMinLength = 3) => {
  let result = ''
  let repetitions = 0

  try {
    for (let i = spamMinLength; i < msg.length; i++) {
      const msgSubstring = msg.substring(0, i)

      const substringRegex = new RegExp(escapeRegExp(msgSubstring), 'g')
      const regexMatch = msg.match(substringRegex)
      const countOccurences = (regexMatch || []).length

      if (countOccurences > repetitions) {
        result = msgSubstring
        repetitions = countOccurences
      } else if (countOccurences === repetitions) {
        result = msgSubstring
      }
    }
  } catch (e) {
    console.log(`getBaseSpam for: ${msg} threw an exception: ${e}`)
    return ''
  }

  return result
}
