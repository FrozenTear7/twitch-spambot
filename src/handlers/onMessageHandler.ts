import { mapMessageToScore } from '../utils/mapMessageToScore'
import { autoResponse } from '../utils/autoResponse'
import { ChatUserstate } from 'tmi.js'
import { urlRegex } from '../utils/constants'
import { postingCooldown } from '../utils/postingCooldown'
import { sayInChannel } from '../messages/sayInChannel'
import { hasSubEmotes } from '../messages/emoteUtils'
import { checkIgnoredMessage } from '../messages/checkIgnoredMessage'
import { MessageData, MessageType } from '../types'
import config from '../config'
import { allowedEmotes } from '../index'
import { logMessage } from '../utils/logMessage'

let prevTimestamp = 0
let prevMsg: string

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
      message: msg,
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
        !checkIgnoredMessage(authorsSeen, x.message) &&
        postingCooldown(x.message, prevMsg, prevTimestamp)
    )
    .map((x) => mapMessageToScore(x.message, currentMessages))
    .sort((x) => x.score)[0]

  if (
    Math.floor(Date.now()) - prevTimestamp > config.sleepInterval &&
    bestMessage &&
    bestMessage.score > config.messageScore
  ) {
    // Save current data for conditions in the next iteration
    prevTimestamp = Math.floor(Date.now())
    prevMsg = bestMessage.message
    currentMessages = []

    logMessage(bestMessage.message, bestMessage.score)

    if (messageType === 'chat') void sayInChannel(bestMessage.message)
    else if (messageType === 'action')
      void sayInChannel(`/me ${bestMessage.message}`) // /me changes the message color to your nickname's color
  }
}
