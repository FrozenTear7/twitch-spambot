import tmi from 'tmi.js'
import stringSimilarity from 'string-similarity'
import request from 'request'
import config from './utils/config.js'
import { sleep } from './utils/sleep.js'

let currentMsgDict = {}
let channelSubEmotes = []
let msgAuthors = []

const client = new tmi.client(config.clientOptions)

const produceSpam = async () => {
  // During the wait we gather messages to the dictionary
  await sleep(config.readInterval)

  let mostPopularSpam = null

  if (currentMsgDict !== {})
    mostPopularSpam = Object.entries(currentMsgDict)
      .filter((entry) => entry[1] >= config.repetitionThreshold)
      .sort((a, b) => b[1] - a[1])[0]

  if (mostPopularSpam) {
    console.log(mostPopularSpam)
    client.say(config.CHANNEL_NAME, mostPopularSpam[0])
    // client.say(config.TWITCH_USERNAME, mostPopularSpam[0])

    // Sleep for some time not to spam too hard
    await sleep(config.sleepInterval)
  }

  currentMsgDict = {}
  msgAuthors = []

  produceSpam() // The spam never ends
}

const addMessage = (msg) => {
  const dictKeys = Object.keys(currentMsgDict)

  if (!currentMsgDict[msg]) currentMsgDict[msg] = 0

  dictKeys.forEach((key) => {
    const similarity = stringSimilarity.compareTwoStrings(msg, key)
    currentMsgDict[key] += similarity
    currentMsgDict[msg] += similarity
  })
}

// Pass every received message to the parser
const onMessageHandler = (target, context, msg, self) => {
  // Ignore own messages
  if (self) {
    return
  }

  if (msgAuthors.includes(context.username)) return

  msgAuthors = [...msgAuthors, context.username]

  if (config.SUBMODE === '0') {
    const msgWords = msg.split(' ')
    const subEmotesIntersection = msgWords.filter((word) =>
      channelSubEmotes.includes(word)
    )

    // We reject messages containing sub emotes
    if (!channelSubEmotes.includes(msg) && subEmotesIntersection.length === 0)
      addMessage(msg)
  } else {
    addMessage(msg)
  }
}

// Start the spam once connected
const onConnectedHandler = (addr, port) => {
  console.log(`* Connected to ${addr}:${port}`)
  console.log('* Starting the spambot')
  produceSpam()
}

const fetchSubEmotes = async (channelId) => {
  request(
    `https://api.twitchemotes.com/api/v4/channels/${channelId}`,
    (error, response, body) => {
      if (error) {
        console.log(error)
      } else {
        body = JSON.parse(body)
        if (body.error) {
          console.log(body.error)
        } else {
          channelSubEmotes = body.emotes.map((emote) => emote.code)
          // console.log(channelSubEmotes)
        }
      }
    }
  )
}

const main = async () => {
  const channelsToIgnore = config.CHANNEL_IDS.split(',')

  channelsToIgnore.forEach((channelId) => fetchSubEmotes(channelId))

  // Register handlers
  client.on('message', onMessageHandler)
  client.on('connected', onConnectedHandler)

  // Start the client
  client.connect()
}

main()
