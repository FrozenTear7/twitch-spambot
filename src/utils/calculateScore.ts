import stringSimilarity from 'string-similarity'
import { MessageData } from './../types'
import { getBaseSpam } from './../messages/spamUtils'

export const calculateScore = (
  msg: string,
  currentMessages: MessageData[]
): number => {
  let score = 0

  currentMessages.forEach(({ message: similarMsg }) => {
    const baseSpam = getBaseSpam(similarMsg)

    if (similarMsg === msg || baseSpam === msg) {
      score += 2.0 // Double the score if messages are similar
    } else {
      const similarity = stringSimilarity.compareTwoStrings(similarMsg, msg)
      const baseSpamSimilarity = stringSimilarity.compareTwoStrings(
        baseSpam,
        msg
      )

      // Pick better similarity from comparing both messages and comparing the message with the base of the other one (considering spam with repeating emotes for example)
      score += similarity > baseSpamSimilarity ? similarity : baseSpamSimilarity
    }
  })

  return score
}
