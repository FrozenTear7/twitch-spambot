import dotenv from 'dotenv'
import tmi from 'tmi.js'
import stringSimilarity from 'string-similarity'
import request from 'request'

dotenv.config({ silent: true })

const readInterval = 3000 // in [ms]
const sleepInterval = 20000
const similarityThreshold = 0.8
const repetitionThreshold = 3

let prevMsg = null
let currentMsgDict = {}
let channelSubEmotes = []

const opts = {
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

const client = new tmi.client(opts)

const produceSpam = async () => {
  // During the wait we gather messages to the dictionary
  await new Promise((resolve) => setTimeout(resolve, readInterval))

  let mostPopularSpam = null

  if (currentMsgDict !== {})
    mostPopularSpam = Object.entries(currentMsgDict)
      .filter((entry) => entry[1] >= repetitionThreshold)
      .sort((a, b) => b[1] - a[1])[0]

  if (mostPopularSpam && mostPopularSpam[0] !== prevMsg) {
    console.log(mostPopularSpam[0])
    client.say(process.env.CHANNEL_NAME, mostPopularSpam[0])
    // client.say(process.env.TWITCH_USERNAME, mostPopularSpam[0])
    prevMsg = mostPopularSpam[0]

    // Sleep for some time not to spam too hard
    await new Promise((resolve) => setTimeout(resolve, sleepInterval))
  }

  currentMsgDict = {}

  produceSpam() // The spam never ends
}

const incrementOrAdd = (msg) => {
  const dictKeys = Object.keys(currentMsgDict)
  let bestMatch = ''

  if (dictKeys.length > 0)
    bestMatch = stringSimilarity.findBestMatch(msg, dictKeys).bestMatch

  // If there is a match similar enough increment the value
  if (bestMatch.target && bestMatch.rating >= similarityThreshold)
    currentMsgDict[bestMatch.target] += 1
  // Else just create an entry
  else currentMsgDict[msg] = 1
}

// Pass every received message to the parser
const onMessageHandler = (target, context, msg, self) => {
  if (self) {
    return
  }

  if (process.env.SUBMODE === '0') {
    const msgWords = msg.split(' ')
    const subEmotesIntersection = msgWords.filter((word) =>
      channelSubEmotes.includes(word)
    )

    // We reject messages containing sub emotes
    if (!channelSubEmotes.includes(msg) && subEmotesIntersection.length === 0)
      incrementOrAdd(msg)
  } else {
    incrementOrAdd(msg)
  }
}

// Start the spam once connected
const onConnectedHandler = (addr, port) => {
  console.log(`* Connected to ${addr}:${port}`)
  console.log('* Starting the spambot')
  produceSpam()
}

// Register handlers
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)

// Fetch sub emotes
request(
  `https://api.twitchemotes.com/api/v4/channels/${process.env.CHANNEL_ID}`,
  (error, response, body) => {
    if (error) {
      console.log(error)
      process.exit()
    } else {
      body = JSON.parse(body)
      if (body.error) {
        console.log(body.error)
        process.exit()
      } else {
        channelSubEmotes = body.emotes.map((emote) => emote.code)
        console.log(channelSubEmotes)
      }
    }
  }
)

// Start the client
client.connect()
