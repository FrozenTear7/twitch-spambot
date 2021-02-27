// Clean up the message from special characters before passing it to the RegExp
const escapeRegExp = (stringToEscape: string) =>
  stringToEscape.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const getBaseSpam = (msg: string, spamMinLength = 3): string => {
  if (msg.length < spamMinLength) return msg

  let result = msg
  let repetitions = 0

  for (let i = spamMinLength; i < msg.length; i++) {
    const msgSubstring = msg.substring(0, i)
    const substringRegexp = new RegExp(escapeRegExp(msgSubstring), 'g')
    const regexMatch = msg.match(substringRegexp)
    const countOccurences = (regexMatch || []).length

    if (countOccurences > repetitions) {
      result = msgSubstring
      repetitions = countOccurences
    } else if (countOccurences === repetitions) {
      result = msgSubstring
    }
  }

  if (result.length > spamMinLength) return result
  else return msg
}
