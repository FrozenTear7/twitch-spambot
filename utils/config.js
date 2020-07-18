import dotenv from 'dotenv'

dotenv.config({ silent: true })

// .env config

const {
  TWITCH_USERNAME,
  CLIENT_TOKEN,
  CHANNEL_NAME,
  CHANNEL_ID,
  SUBMODE,
} = process.env

if (
  TWITCH_USERNAME === undefined ||
  CLIENT_TOKEN === undefined ||
  CHANNEL_NAME === undefined ||
  CHANNEL_ID === undefined ||
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
const similarityThreshold = +programArgs[2] || 0.8 // 0 - 1 similarity range
const repetitionThreshold = +programArgs[3] || 5

export default {
  TWITCH_USERNAME,
  CLIENT_TOKEN,
  CHANNEL_NAME,
  CHANNEL_ID,
  SUBMODE,
  clientOptions,
  readInterval,
  sleepInterval,
  similarityThreshold,
  repetitionThreshold,
}
