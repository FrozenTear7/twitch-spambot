import stringSimilarity from 'string-similarity'
import config from '../config/config.js'
import { getBaseSpam } from '../messages/spamUtils.js'
import { checkIgnoredMessage } from '../messages/checkIgnoredMessage.js'
import { isSubEmote } from '../messages/emoteUtils.js'
import { sayInChannel } from '../messages/sayInChannel.js'

const urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi

// Pass every received message to the parser
export const onMessageHandler = (
  client,
  allowedEmotes,
  currentMsgDict,
  msgAuthors,
  authorsSeen
) => {
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
        () => sayInChannel(client, `@${context.username} ConcernDoge 👌`),
        2000 + Math.floor(Math.random() * 2001) // Act like a human and randomize the response time
      )
    }

    // Skip sub emotes
    let emoteCodes = []
    if (context.emotes)
      emoteCodes = Object.keys(context.emotes).map((code) => +code)
    if (msgAuthors.includes(context.username)) return

    // Skip URLs
    const urlRegExp = new RegExp(urlRegex)
    if (msg.match(urlRegExp)) return

    msgAuthors.push(context.username)
    authorsSeen.push(context.username) // Gathering all authors so we can avoid whispering them unintentionally

    addMessage(
      msg,
      emoteCodes,
      context['message-type'],
      allowedEmotes,
      currentMsgDict,
      authorsSeen
    )
  }
}

const addMessage = (
  msg,
  emoteCodes,
  messageType,
  allowedEmotes,
  currentMsgDict,
  authorsSeen
) => {
  const dictKeys = Object.keys(currentMsgDict)

  /* If we want to ignore the message we still add its similarity 
    to other messages' scores, but we don't add it to the dictionary */
  if (
    !isSubEmote(allowedEmotes, emoteCodes) &&
    !currentMsgDict[msg] &&
    !checkIgnoredMessage(authorsSeen, msg)
  )
    currentMsgDict[msg] = { score: 1, messageType: messageType }

  dictKeys.forEach((key) => {
    const similarity = stringSimilarity.compareTwoStrings(msg, key)
    const baseSpamSimilarity = stringSimilarity.compareTwoStrings(
      getBaseSpam(msg),
      key
    )

    const finalSimilarity =
      similarity > baseSpamSimilarity ? similarity : baseSpamSimilarity

    currentMsgDict[key].score += finalSimilarity

    // As earlier, if the messages wasn't added we don't add to its own score
    if (
      !isSubEmote(allowedEmotes, emoteCodes) &&
      !checkIgnoredMessage(authorsSeen, msg)
    )
      currentMsgDict[msg].score += finalSimilarity
  })
}
