import tmi from 'tmi.js'
import whitelistEmotes from '../config/whitelistEmotes.json'
import { getAllowedEmotes } from './messages/emoteUtils'
import { onNoticeHandler } from './handlers/onNoticeHandler'
import { onMessageHandler } from './handlers/onMessageHandler'
import config from './config'

// Export globally unchanged variables
export let allowedEmotes: number[] = []
export let client: tmi.Client

const main = async () => {
  client = new tmi.client(config.clientOptions)

  // Fetch global and your whitelisted emotes
  try {
    console.log('Fetching all global emotes')
    allowedEmotes = await getAllowedEmotes(whitelistEmotes.channels)
    console.log('Finished fetching global emotes')
  } catch (e) {
    console.log((e as Error).message)
    process.exit(0)
  }

  // Register handlers
  client.on('message', onMessageHandler)
  client.on('connected', (addr, port) =>
    console.log(`* Connected to ${addr}:${port}`)
  )
  client.on('notice', onNoticeHandler)

  // Start the client
  try {
    await client.connect()
  } catch (_e) {
    console.log('Bot shutting down, due to an authentication error')
    process.exit(0)
  }

  console.log('Starting the bot')
}

// Finish the script gracefully
process.on('SIGINT', () => {
  console.log('Bot shutting down FeelsOkayMan')
  void client.disconnect()
  process.exit()
})

void main()
