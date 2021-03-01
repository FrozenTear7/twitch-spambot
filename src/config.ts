import dotenv from 'dotenv'
import colors from 'colors'

dotenv.config()

// .env config

const { TWITCH_USERNAME, CLIENT_TOKEN } = process.env

if (!TWITCH_USERNAME || !CLIENT_TOKEN) {
  console.log(colors.red('Please provide a valid .env config'))
  process.exit(0)
}

// Program arguments read from the console

const programArgs = process.argv.slice(2)

const channelName = programArgs[0]
const readInterval = +programArgs[1] || 3000 // in [ms]
const sleepInterval = +programArgs[2] || 30000 // in [ms]
const messageScore = +programArgs[3] || 4
const mentionResponse = +programArgs[4] || 0 // 0 - don't respond, 1 - respond with the default message to the sender

if (!channelName) {
  console.log(colors.red('Please provide a channel name'))
  process.exit(0)
}

if (![0, 1].includes(mentionResponse)) {
  console.log(colors.red('Please provide a valid mentionResponse value'))
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
    password: process.env.CLIENT_TOKEN,
  },
  channels: [channelName],
}

export default {
  TWITCH_USERNAME,
  CLIENT_TOKEN,
  channelName,
  clientOptions,
  readInterval,
  sleepInterval,
  messageScore,
  mentionResponse,
}
