import stringSimilarity from 'string-similarity'
import config from '../config/config.js'
import { getBaseSpam } from '../messages/spamUtils.js'
import { checkIgnoredMessage } from '../messages/checkIgnoredMessage.js'
import { isSubEmote } from '../messages/emoteUtils.js'
import { sayInChannel } from '../messages/sayInChannel.js'
import { allowedEmotes } from '../index.js'

const urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
let messageCooldown = false
let prevTimestamp = 0
let prevMsg

// Pass every received message to the parser
export const onMessageHandler = (currentMessages, authorsSeen) => {
  return (target, context, msg, self) => {
    // Ignore own messages
    if (self) {
      return
    }

    // If enabled, respond to the person who mentioned you
    if (
      config.mentionResponse === 1 &&
      msg.toLowerCase().includes(config.TWITCH_USERNAME.toLowerCase())
    ) {
      setTimeout(
        () => sayInChannel(`@${context.username} ConcernDoge 👌`),
        2000 + Math.floor(Math.random() * 2001) // Act like a human and randomize the response time
      )
    }

    // Skip sub emotes
    let emoteCodes = []
    if (context.emotes)
      emoteCodes = Object.keys(context.emotes).map((code) => +code)

    // Skip URLs
    const urlRegExp = new RegExp(urlRegex)
    if (msg.match(urlRegExp)) return

    authorsSeen.push(context.username) // Gathering all authors so we can avoid whispering them unintentionally

    addMessage(
      msg,
      emoteCodes,
      context['message-type'],
      context.username,
      currentMessages,
      authorsSeen
    )
  }
}

const addMessage = (
  msg,
  emoteCodes,
  messageType,
  author,
  currentMessages,
  authorsSeen
) => {
  // If posting is not on cooldown and passes all conditions post it immediately if the score is high enough
  if (
    !isSubEmote(allowedEmotes, emoteCodes) &&
    !checkIgnoredMessage(authorsSeen, msg) &&
    !currentMessages
      .filter(
        (message) =>
          Math.floor(Date.now()) - message.timestamp <= config.readInterval
      )
      .some((currentMessage) => currentMessage.author === author) && // Filter out authors who recently posted something
    (Math.floor(Date.now()) - prevTimestamp > 30000 // If an identical message was sent 30s ago ignore the duplicates
      ? true
      : msg != prevMsg)
  ) {
    currentMessages.push({
      message: msg,
      messageType: messageType,
      author: author,
      timestamp: Math.floor(Date.now()),
    })

    const score = calculateScore(msg, currentMessages)

    if (!messageCooldown && score > config.repetitionThreshold) {
      messageCooldown = true

      const currentDate = new Date()
      const currentDateFormatted = currentDate.toLocaleTimeString('pl-PL')
      console.log(
        `[${currentDateFormatted}, #${
          config.channelName
        }, score: ${score.toFixed(2)}]: ${msg}`
      )

      if (messageType === 'chat') sayInChannel(msg)
      else if (messageType === 'action') sayInChannel(`/me ${msg}`) // /me changes the message color to your nickname's color

      // Save current data for conditions in the next iteration
      prevTimestamp = Math.floor(Date.now())
      prevMsg = msg

      // Clear without losing reference
      currentMessages.length = 0

      setTimeout(() => {
        messageCooldown = false
      }, config.sleepInterval)
    }
  }
}

const calculateScore = (msg, currentMessages) => {
  let score = 0

  currentMessages
    .filter(
      (message) =>
        Math.floor(Date.now()) - message.timestamp <= config.readInterval
    )
    .forEach((similarMsg) => {
      const similarity = stringSimilarity.compareTwoStrings(
        similarMsg.message,
        msg
      )
      const baseSpamSimilarity = stringSimilarity.compareTwoStrings(
        getBaseSpam(similarMsg.message),
        msg
      )

      const finalSimilarity =
        similarity > baseSpamSimilarity ? similarity : baseSpamSimilarity

      score += finalSimilarity
    })

  return score
}
