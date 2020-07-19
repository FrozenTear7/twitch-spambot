import dotenv from 'dotenv'

dotenv.config({ silent: true })

// .env config

const {
  TWITCH_USERNAME,
  CLIENT_TOKEN,
  CHANNEL_NAME,
  CHANNEL_IDS,
  SUBMODE,
} = process.env

if (
  TWITCH_USERNAME === undefined ||
  CLIENT_TOKEN === undefined ||
  CHANNEL_NAME === undefined ||
  CHANNEL_IDS === undefined ||
  SUBMODE === undefined
) {
  console.log('Please provide a valid .env config')
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
  channels: [process.env.CHANNEL_NAME],
}

// Program arguments read from the console

const programArgs = process.argv.slice(2)

const readInterval = +programArgs[0] || 3000 // in [ms]
const sleepInterval = +programArgs[1] || 30000 // in [ms]
const repetitionThreshold = +programArgs[2] || 5

export default {
  TWITCH_USERNAME,
  CLIENT_TOKEN,
  CHANNEL_NAME,
  CHANNEL_IDS,
  SUBMODE,
  clientOptions,
  readInterval,
  sleepInterval,
  repetitionThreshold,
}
