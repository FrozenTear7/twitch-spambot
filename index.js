import tmi from 'tmi.js'
import stringSimilarity from 'string-similarity'
import request from 'request'
import config from './utils/config.js'
import { sleep } from './utils/sleep.js'

let currentMsgDict = {}
let channelSubEmotes = []
let msgAuthors = []

const client = new tmi.client(config.clientOptions)

const getBaseSpam = (msg) => {
  const minLength = 3

  let result = ''
  let repetitions = 0

  for (let i = minLength; i < msg.length; i++) {
    const msgSubstring = msg.substring(0, i)

    const substringRegex = new RegExp(msgSubstring, 'g')
    const regexMatch = msg.match(substringRegex)
    const countOccurences = (regexMatch || []).length

    if (countOccurences > repetitions) {
      result = msgSubstring
      repetitions = countOccurences
    } else if (countOccurences === repetitions) {
      result = msgSubstring
    }
  }

  return result
}

const isSubEmote = (msg) => {
  if (channelSubEmotes.length !== 0) {
    const msgWords = msg.split(' ')

    for (const subEmote of channelSubEmotes)
      if (
        msgWords.some(
          (word) => word === subEmote || word.includes(`${subEmote}_`)
        )
      )
        return true
  }

  return false
}

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
    client.say(config.channelName, mostPopularSpam[0])

    // Sleep for some time not to spam too hard
    await sleep(config.sleepInterval)
  }

  currentMsgDict = {}
  msgAuthors = []

  produceSpam() // The spam never ends
}

const addMessage = (msg) => {
  const dictKeys = Object.keys(currentMsgDict)

  if (!isSubEmote(msg) && !currentMsgDict[msg]) currentMsgDict[msg] = 1

  dictKeys.forEach((key) => {
    const similarity = stringSimilarity.compareTwoStrings(msg, key)
    const baseSpamSimilarity = stringSimilarity.compareTwoStrings(
      getBaseSpam(msg),
      key
    )

    const finalSimilarity =
      similarity > baseSpamSimilarity ? similarity : baseSpamSimilarity

    currentMsgDict[key] += finalSimilarity
    if (!isSubEmote(msg)) currentMsgDict[msg] += finalSimilarity
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

  addMessage(msg)
}

// Start the spam once connected
const onConnectedHandler = (addr, port) => {
  console.log(`* Connected to ${addr}:${port}`)
  console.log('* Starting the spambot')
  produceSpam()
}

const doRequest = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (error, res, body) => {
      if (!error && res.statusCode == 200) {
        resolve(body)
      } else {
        reject(error)
      }
    })
  })
}

const fetchAllSubEmotes = async (channelsToIgnore) => {
  await Promise.all(
    channelsToIgnore.map(async (channelId) => {
      const body = await doRequest(
        `https://api.twitchemotes.com/api/v4/channels/${channelId}`
      )
      channelSubEmotes = [
        ...channelSubEmotes,
        ...JSON.parse(body).emotes.map((emote) => emote.code),
      ]
    })
  )
}

const main = async () => {
  const channelsToIgnore = config.CHANNEL_IDS.split(',')

  console.log('Fetching all sub emotes')
  await fetchAllSubEmotes(channelsToIgnore)
  console.log('Finished fetching sub emotes')

  // console.log(channelSubEmotes)

  // Register handlers
  client.on('message', onMessageHandler)
  client.on('connected', onConnectedHandler)

  // Start the client
  client.connect()
}

main()
