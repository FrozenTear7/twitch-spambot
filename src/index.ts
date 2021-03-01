import tmi from 'tmi.js'
import whitelistEmotes from '../config/whitelistEmotes.json'
import { getAllowedEmotes } from './messages/emoteUtils'
import { onNoticeHandler } from './handlers/onNoticeHandler'
import { onMessageHandler } from './handlers/onMessageHandler'
import config from './config'
import colors from 'colors'

// Export globally unchanged variables
export let allowedEmotes: number[] = []
export let client: tmi.Client

const main = async () => {
  client = new tmi.client(config.clientOptions)

  // Fetch global and your whitelisted emotes
  try {
    console.log(colors.dim(colors.cyan('Fetching all global emotes')))
    allowedEmotes = await getAllowedEmotes(whitelistEmotes.channels)
    console.log(colors.cyan('Finished fetching global emotes'))
  } catch (e) {
    console.log(colors.red((e as Error).message))
    process.exit(0)
  }

  // Register handlers
  client.on('message', onMessageHandler)
  client.on('connected', (addr, port) =>
    console.log(colors.cyan(`Connected to ${addr}:${port}`))
  )
  client.on('notice', onNoticeHandler)

  // Start the client
  try {
    await client.connect()
  } catch (_e) {
    console.log(colors.red('Bot shutting down, due to an authentication error'))
    process.exit(0)
  }
}

// Finish the script gracefully
process.on('SIGINT', () => {
  console.log(colors.dim('Bot shutting down FeelsOkayMan'))
  void client.disconnect()
  process.exit(0)
})

main().then(
  () => {
    console.log(colors.green('Bot started'))
  },
  (e) => {
    console.log(
      colors.red(`An exception occured at top level: ${(e as Error).message}`)
    )
  }
)
