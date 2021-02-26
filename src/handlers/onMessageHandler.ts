import { calculateScore } from './../utils/calculateScore'
import { ChatUserstate } from 'tmi.js'
import { urlRegex } from './../utils/constants'
import { postingCooldown } from './../utils/postingCooldown'
import { sayInChannel } from './../messages/sayInChannel'
import { hasSubEmotes } from './../messages/emoteUtils'
import { checkIgnoredMessage } from './../messages/checkIgnoredMessage'
import { MessageData, MessageType } from './../types'
import config from '../config'
import { allowedEmotes } from '../index'
import { logMessage } from '../utils/logMessage'

let messageCooldown = false
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

  if (author) authorsSeen = [...authorsSeen, author] // Gathering all authors so we can avoid whispering them unintentionally

  // If enabled, respond to the person who mentioned you
  if (
    config.mentionResponse === 1 &&
    msg.toLowerCase().includes(config.TWITCH_USERNAME.toLowerCase()) &&
    author
  ) {
    setTimeout(
      () => sayInChannel(`@${author} ConcernDoge 👌`),
      2000 + Math.floor(Math.random() * 2001) // Act like a human and randomize the response time
    )
  }

  // Skip sub emotes
  const emoteCodes: number[] = context.emotes
    ? Object.keys(context.emotes).map((code) => +code)
    : []

  // Skip URLs
  const urlRegExp = new RegExp(urlRegex)
  if (urlRegExp.exec(msg)) return

  // Skip if this author already posted something in the given interval
  if (
    currentMessages.some((currentMessage) => currentMessage.author === author)
  )
    return

  addMessage(msg, emoteCodes, messageType, author)
}

const addMessage = (
  msg: string,
  emoteCodes: number[],
  messageType: MessageType,
  author?: string
) => {
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
      emoteCodes: emoteCodes,
    },
  ]

  // If posting is not on cooldown
  if (!messageCooldown) {
    // Map messages to their scores and get the best one
    const bestMessage = currentMessages
      .filter(
        (x) =>
          !hasSubEmotes(allowedEmotes, x.emoteCodes) &&
          !checkIgnoredMessage(authorsSeen, x.message) &&
          postingCooldown(x.message, prevMsg, prevTimestamp)
      )
      .map((x) => mapMessageToScores(x.message, currentMessages))
      .sort((x) => x.score)[0]

    if (bestMessage && bestMessage.score > config.messageScore) {
      messageCooldown = true

      logMessage(bestMessage.message, bestMessage.score)

      if (messageType === 'chat') sayInChannel(bestMessage.message)
      else if (messageType === 'action')
        sayInChannel(`/me ${bestMessage.message}`) // /me changes the message color to your nickname's color

      // Save current data for conditions in the next iteration
      prevTimestamp = Math.floor(Date.now())
      prevMsg = bestMessage.message
      currentMessages = []

      setTimeout(() => {
        messageCooldown = false
      }, config.sleepInterval)
    }
  }
}

const mapMessageToScores = (msg: string, currentMessages: MessageData[]) => {
  return {
    message: msg,
    score: calculateScore(msg, currentMessages),
  }
}
