// Clean up the message from special characters before passing it to the RegExp
const escapeRegExp = (stringToEscape: string) =>
  stringToEscape.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const getBaseSpam = (msg: string, spamMinLength = 3): string => {
  let result = ''
  let repetitions = 0

  try {
    for (let i = spamMinLength; i < msg.length; i++) {
      const msgSubstring = msg.substring(0, i)

      const substringRegexp = new RegExp(escapeRegExp(msgSubstring), 'g')
      const regexMatch = substringRegexp.exec(msg)
      const countOccurences = (regexMatch || []).length

      if (countOccurences > repetitions) {
        result = msgSubstring
        repetitions = countOccurences
      } else if (countOccurences === repetitions) {
        result = msgSubstring
      }
    }
  } catch (e) {
    console.log(`getBaseSpam for: ${msg} threw an exception: ${e as string}`)
    return ''
  }

  return result
}
