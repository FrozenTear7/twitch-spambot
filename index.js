import tmi from 'tmi.js'
import stringSimilarity from 'string-similarity'
import config from './utils/config.js'
import { sleep } from './utils/sleep.js'
import ignoredWordsJson from './utils/ignoredWords.json'
import whitelistEmotes from './utils/whitelistEmotes.json'
import { getAllowedEmotes, isSubEmote } from './utils/emoteUtils.js'
import { getBaseSpam } from './utils/spamUtils.js'

// Hold data for the current spam
let currentMsgDict = {}
let allowedEmotes = []
let msgAuthors = []
let authorsSeen = []

const ignoreCharacters = ['!', '@', '#', '$', '%', '^', '&', '*'] // Ignore commands, whispers, etc.
const noticeTypeQuit = [
  'msg_channel_suspended',
  'msg_banned',
  'msg_followersonly',
] // Notice types to quit on

const urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi

const client = new tmi.client(config.clientOptions)

const produceSpam = async () => {
  // During the wait we gather messages to the dictionary
  await sleep(config.readInterval)

  let mostPopularSpam = null

  // Filter out only messages that meet the given threshold, then sort by usage
  if (currentMsgDict !== {})
    mostPopularSpam = Object.entries(currentMsgDict)
      .filter((entry) => entry[1].score >= config.repetitionThreshold)
      .sort((a, b) => b[1].score - a[1].score)[0]

  if (mostPopularSpam) {
    console.log(mostPopularSpam)

    const messageType = mostPopularSpam[1].messageType

    if (messageType === 'chat')
      client.say(config.channelName, mostPopularSpam[0])
    else if (messageType === 'action')
      client.say(config.channelName, `/me ${mostPopularSpam[0]}`) // /me changes the message color to your nickname's color

    // Sleep for some time to not spam too hard
    await sleep(config.sleepInterval)
  }

  currentMsgDict = {}
  msgAuthors = []

  produceSpam() // The spam never ends
}

const checkIgnoredMessage = (msg) => {
  // Skip commands, user whispers and messages containing ignored words from ./utils/ignoredWords.json
  return (
    ignoreCharacters.includes(msg[0]) ||
    ignoredWordsJson.ignoredWords.some((substring) =>
      msg.includes(substring)
    ) ||
    authorsSeen.some((author) => msg.includes(author))
  )
}

const addMessage = (msg, emoteCodes, messageType) => {
  const dictKeys = Object.keys(currentMsgDict)

  /* If we want to ignore the message we still add its similarity 
  to other messages' scores, but we don't add it to the dictionary */
  if (
    !isSubEmote(allowedEmotes, emoteCodes) &&
    !currentMsgDict[msg] &&
    !checkIgnoredMessage(msg)
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
    if (!isSubEmote(allowedEmotes, emoteCodes) && !checkIgnoredMessage(msg))
      currentMsgDict[msg].score += finalSimilarity
  })
}

// Pass every received message to the parser
const onMessageHandler = (target, context, msg, self) => {
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
      () =>
        client.say(config.channelName, `@${context.username} ConcernDoge 👌`),
      2000 + Math.floor(Math.random() * 2001) // Act like a human and randomize the response time
    )
  }

  const messageType = context['message-type']

  // Skip sub emotes
  let emoteCodes = []
  if (context.emotes)
    emoteCodes = Object.keys(context.emotes).map((code) => +code)
  if (msgAuthors.includes(context.username)) return

  // Skip URLs
  const urlRegExp = new RegExp(urlRegex)
  if (msg.match(urlRegExp)) return

  msgAuthors = [...msgAuthors, context.username]
  authorsSeen = [...authorsSeen, context.username] // Gathering all authors so we can avoid whispering them unintentionally

  addMessage(msg, emoteCodes, messageType)
}

const onConnectedHandler = (addr, port) => {
  console.log(`* Connected to ${addr}:${port}`)
  console.log('* Starting the spambot')

  // Start the spam once connected
  produceSpam()
}

const onNoticeHandler = (channel, noticeType, noticeMsg) => {
  if (noticeTypeQuit.some(noticeType)) {
    console.log(`Exception during execution: ${noticeMsg}`)
    process.exit(0)
  } else if (noticeType === 'host_target_went_offline') {
    console.log('Stream ended, stopping the spam')
    process.exit(0)
  } else {
    console.log(`Unhandled notice of type: ${noticeType} - ${noticeMsg}`)
    console.log(
      'Address this in the Issues on Github if something important breaks here'
    )
  }
}

const main = async () => {
  console.log('Fetching all global emotes')
  allowedEmotes = await getAllowedEmotes(whitelistEmotes.channels)
  console.log('Finished fetching global emotes')

  // Register handlers
  client.on('message', onMessageHandler)
  client.on('connected', onConnectedHandler)
  client.on('notice', onNoticeHandler)

  // Start the client
  client.connect()
}

main()
