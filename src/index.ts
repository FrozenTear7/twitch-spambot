import { handleCatch } from './utils/handleCatch'
import tmi from 'tmi.js'
import whitelistEmotes from '../config/whitelistEmotes.json'
import ownPackage from '../package.json'
import { getAllowedEmotes } from './messages/emoteUtils'
import { onNoticeHandler } from './handlers/onNoticeHandler'
import { onMessageHandler } from './handlers/onMessageHandler'
import config from './config'
import colors from 'colors'
import axios from 'axios'

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
    handleCatch('Exception while fetching emotes', e)
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

// Check if the bot version is up-to-date
axios
  .get(
    'https://api.github.com/repos/frozentear7/twitch-spambot/releases/latest'
  )
  .then((res) => {
    if (res.data) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (`v${ownPackage.version}` !== res.data.tag_name) {
        console.log(
          colors.red(
            'Your version of the bot is outdated. Please download the new version from: https://github.com/FrozenTear7/twitch-spambot/releases'
          )
        )
      }
    } else {
      console.log(colors.red('Failed to check the latest version of the bot'))
    }
  })
  .catch((e) => {
    handleCatch(
      'An exception occured, while checking the latest version of the bot',
      e
    )
  })
  .finally(() => {
    // Run the bot after version checks
    main()
      .then(() => console.log(colors.green('Bot started')))
      .catch((e) => handleCatch('An exception occured at top level', e))
  })
