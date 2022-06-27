import 'dotenv/config'
import colors from 'colors'

// .env config

const {
  TWITCH_USERNAME,
  TWITCH_PASSWORD,
  CLIENT_TOKEN,
  CLIENT_ID,
  CLIENT_SECRET,
} = process.env

if (
  !TWITCH_USERNAME ||
  !TWITCH_PASSWORD ||
  !CLIENT_TOKEN ||
  !CLIENT_ID ||
  !CLIENT_SECRET
) {
  console.log(colors.red('Please provide a valid .env config'))
  process.exit(0)
}

// Program arguments read from the console

const programArgs = process.argv.slice(2)

const channelName = programArgs[0]
const readInterval = +programArgs[1] || 3000 // in [ms]
const sleepInterval = +programArgs[2] || 30000 // in [ms]
const messageScore = +programArgs[3] || 5
const mentionResponse = programArgs[4] // don't autorespond if none provided, otherwise respond with the provided message

if (!channelName) {
  console.log(colors.red('Please provide a channel name'))
  process.exit(0)
}

// Options passed to the Twitch client

const clientOptions = {
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_PASSWORD,
  },
  channels: [channelName],
}

export default {
  TWITCH_USERNAME,
  TWITCH_PASSWORD,
  CLIENT_TOKEN,
  CLIENT_ID,
  CLIENT_SECRET,
  channelName,
  clientOptions,
  readInterval,
  sleepInterval,
  messageScore,
  mentionResponse,
}
