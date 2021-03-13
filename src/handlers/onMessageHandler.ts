import { mapMessageToScore } from '../utils/mapMessageToScore'
import { autoResponse } from '../utils/autoResponse'
import { ChatUserstate } from 'tmi.js'
import { urlRegex } from '../utils/constants'
import { sayInChannel } from '../messages/sayInChannel'
import { hasSubEmotes } from '../messages/emoteUtils'
import { checkIgnoredMessage } from '../messages/checkIgnoredMessage'
import { MessageData, MessageType } from '../types'
import config from '../config'
import { allowedEmotes } from '../index'

let currentMessages: MessageData[] = []
let authorsSeen: string[] = []

// Pass every received message to the parser
export const onMessageHandler = (
  _target: string,
  context: ChatUserstate,
  msg: string,
  self: boolean
): void => {
  // Ignore own messages
  if (self) {
    return
  }

  const messageType: MessageType = context['message-type']
  const author = context.username
  const urlRegExp = new RegExp(urlRegex)
  if (author) authorsSeen = [...authorsSeen, author] // Gathering all authors so we can avoid whispering them unintentionally

  // Respond to whoever mentioned you if enabled
  void autoResponse(msg, author)

  // Skip sub emotes
  const emoteCodes: number[] = context.emotes
    ? Object.keys(context.emotes).map((code) => +code)
    : []

  // Skip if this author already posted something in the given interval or if detected an URL
  if (
    currentMessages.some(
      (currentMessage) => currentMessage.author === author
    ) ||
    msg.match(urlRegExp)
  )
    return

  currentMessages = [
    ...currentMessages.filter(
      (message) =>
        Math.floor(Date.now()) - message.timestamp <= config.readInterval
    ),
    {
      message: msg.replace(/( 󠀀)+$/, ''), // Remove the special character for spamming at the end if present
      messageType: messageType,
      author: author,
      timestamp: Math.floor(Date.now()),
      emoteCodes: emoteCodes,
    },
  ]

  const bestMessage = currentMessages
    .filter(
      (x) =>
        !hasSubEmotes(allowedEmotes, x.emoteCodes) &&
        !checkIgnoredMessage(authorsSeen, x.message)
    )
    .map((x) => mapMessageToScore(x.message, currentMessages))
    .sort((x) => x.score)[0]

  if (bestMessage && bestMessage.score > config.messageScore)
    void sayInChannel(bestMessage.message, bestMessage.score, messageType)
}
