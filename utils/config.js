import dotenv from 'dotenv'

dotenv.config({ silent: true })

// .env config

const { TWITCH_USERNAME, CLIENT_TOKEN, CHANNEL_NAME, CHANNEL_IDS } = process.env

if (
  TWITCH_USERNAME === undefined ||
  CLIENT_TOKEN === undefined ||
  CHANNEL_IDS === undefined
) {
  console.log('Please provide a valid .env config')
  process.exit()
}

// Program arguments read from the console

const programArgs = process.argv.slice(2)

const channelName = programArgs[0]
const readInterval = +programArgs[1] || 5000 // in [ms]
const sleepInterval = +programArgs[2] || 30000 // in [ms]
const repetitionThreshold = +programArgs[3] || 4

if (!channelName) {
  console.log('Please provide a channel name')
  process.exit()
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
  CHANNEL_IDS,
  channelName,
  clientOptions,
  readInterval,
  sleepInterval,
  repetitionThreshold,
}
