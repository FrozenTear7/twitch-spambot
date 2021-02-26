import stringSimilarity from 'string-similarity'
import { MessageData } from './../types'
import { getBaseSpam } from './../messages/spamUtils'

export const calculateScore = (
  msg: string,
  currentMessages: MessageData[]
): number => {
  let score = 0

  currentMessages.forEach((similarMsg) => {
    const similarity = stringSimilarity.compareTwoStrings(
      similarMsg.message,
      msg
    )
    const baseSpamSimilarity = stringSimilarity.compareTwoStrings(
      getBaseSpam(similarMsg.message),
      msg
    )

    // Pick better similarity from comparing both messages and comparing the message with the base of the other one (considering spam with repeating emotes for example)
    score += similarity > baseSpamSimilarity ? similarity : baseSpamSimilarity
  })

  return score
}
