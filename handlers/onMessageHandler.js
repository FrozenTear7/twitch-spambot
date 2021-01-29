import stringSimilarity from 'string-similarity'
import config from '../config/config.js'
import { getBaseSpam } from '../messages/spamUtils.js'
import { checkIgnoredMessage } from '../messages/checkIgnoredMessage.js'
import { isSubEmote } from '../messages/emoteUtils.js'
import { sayInChannel } from '../messages/sayInChannel.js'
import { allowedEmotes } from '../index.js'
import { logMessage } from '../utils/logMessage.js'

const urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
let messageCooldown = false
let prevTimestamp = 0
let prevMsg

let currentMessages = []
let authorsSeen = []

// Pass every received message to the parser
export const onMessageHandler = (target, context, msg, self) => {
  // Ignore own messages
  if (self) {
    return
  }

  const messageType = context['message-type']
  const author = context.username

  authorsSeen = [...authorsSeen, author] // Gathering all authors so we can avoid whispering them unintentionally

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

  // Skip if this author already posted something in the given interval
  if (
    currentMessages.some((currentMessage) => currentMessage.author === author)
  )
    return

  addMessage(msg, emoteCodes, messageType, author)
}

const addMessage = (msg, emoteCodes, messageType, author) => {
  // Remove the messages past their time and add the new message
  currentMessages = [
    ...currentMessages.filter(
      (message) =>
        Math.floor(Date.now()) - message.timestamp <= config.readInterval
    ),
    {
      message: msg,
      messageType: messageType,
      author: author,
      timestamp: Math.floor(Date.now()),
    },
  ]

  // If posting is not on cooldown and passes all conditions post it immediately if the score is high enough
  if (
    !messageCooldown &&
    !isSubEmote(allowedEmotes, emoteCodes) &&
    !checkIgnoredMessage(authorsSeen, msg) &&
    (Math.floor(Date.now()) - prevTimestamp > 30000 // If an identical message was sent 30s ago ignore the duplicates
      ? true
      : msg != prevMsg)
  ) {
    const score = calculateScore(msg, currentMessages)

    if (score > config.repetitionThreshold) {
      messageCooldown = true

      logMessage(msg, score)

      if (messageType === 'chat') sayInChannel(msg)
      else if (messageType === 'action') sayInChannel(`/me ${msg}`) // /me changes the message color to your nickname's color

      // Save current data for conditions in the next iteration
      prevTimestamp = Math.floor(Date.now())
      prevMsg = msg
      currentMessages = []

      setTimeout(() => {
        messageCooldown = false
      }, config.sleepInterval)
    }
  }
}

const calculateScore = (msg, currentMessages) => {
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
