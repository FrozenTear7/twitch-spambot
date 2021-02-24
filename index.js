import tmi from 'tmi.js'
import config from './config/config.js'
import whitelistEmotes from './config/whitelistEmotes.json'
import { getAllowedEmotes } from './messages/emoteUtils.js'
import { onNoticeHandler } from './handlers/onNoticeHandler.js'
import { onMessageHandler } from './handlers/onMessageHandler.js'

export let allowedEmotes = []
export let client

const main = async () => {
  client = new tmi.client(config.clientOptions)

  console.log('Fetching all global emotes')
  allowedEmotes = await getAllowedEmotes(whitelistEmotes.channels)
  console.log('Finished fetching global emotes')

  // Register handlers
  client.on('message', onMessageHandler)
  client.on('connected', (addr, port) =>
    console.log(`* Connected to ${addr}:${port}`)
  )
  client.on('notice', onNoticeHandler)

  // Start the client
  client.connect()
  console.log('Starting the bot')
}

process.on('SIGINT', function () {
  console.log('Bot shutting down FeelsOkayMan')
  client.disconnect()
  process.exit()
})

main()
