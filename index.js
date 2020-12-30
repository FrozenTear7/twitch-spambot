import tmi from 'tmi.js'
import config from './config/config.js'
import whitelistEmotes from './config/whitelistEmotes.json'
import { getAllowedEmotes } from './messages/emoteUtils.js'
import { onNoticeHandler } from './handlers/onNoticeHandler.js'
import { onConnectedHandler } from './handlers/onConnectedHandler.js'
import { onMessageHandler } from './handlers/onMessageHandler.js'

// Hold data for the current spam
let currentMsgDict = {}
let allowedEmotes = []
let msgAuthors = []
let authorsSeen = []

const client = new tmi.client(config.clientOptions)

const main = async () => {
  console.log('Fetching all global emotes')
  allowedEmotes = await getAllowedEmotes(whitelistEmotes.channels)
  console.log('Finished fetching global emotes')

  // Register handlers
  client.on(
    'message',
    onMessageHandler(
      client,
      allowedEmotes,
      currentMsgDict,
      msgAuthors,
      authorsSeen
    )
  )
  client.on('connected', onConnectedHandler(client, currentMsgDict, msgAuthors))
  client.on('notice', onNoticeHandler)

  // Start the client
  client.connect()
}

// Temporarily checking if anything else breaks
try {
  main()
} catch (e) {
  console.log(e)
}
