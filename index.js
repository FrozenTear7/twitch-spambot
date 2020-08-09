import tmi from 'tmi.js'
import stringSimilarity from 'string-similarity'
import request from 'request'
import config from './utils/config.js'
import { sleep } from './utils/sleep.js'

let currentMsgDict = {}
let globalEmotes = []
let msgAuthors = []

const ignoreCharacters = ['!', '@', '#', '$', '%', '^', '&', '*']

const client = new tmi.client(config.clientOptions)

const getBaseSpam = (msg) => {
  const minLength = 3

  let result = ''
  let repetitions = 0

  try {
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
  } catch (e) {
    return ''
  }

  return result
}

const isSubEmote = (emoteCodes) => {
  if (emoteCodes.length !== 0)
    if (
      emoteCodes.filter((code) => !globalEmotes.includes(code)).length !== 0
    ) {
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
      .filter((entry) => entry[1].score >= config.repetitionThreshold)
      .sort((a, b) => b[1].score - a[1].score)[0]

  if (mostPopularSpam) {
    console.log(mostPopularSpam)

    if (mostPopularSpam[1].messageType === 'chat')
      client.say(config.channelName, mostPopularSpam[0])
    else if (mostPopularSpam[1].messageType === 'action')
      client.say(config.channelName, `/me ${mostPopularSpam[0]}`)

    // Sleep for some time not to spam too hard
    await sleep(config.sleepInterval)
  }

  currentMsgDict = {}
  msgAuthors = []

  produceSpam() // The spam never ends
}

const addMessage = (msg, emoteCodes, messageType) => {
  const dictKeys = Object.keys(currentMsgDict)

  if (!isSubEmote(emoteCodes) && !currentMsgDict[msg])
    currentMsgDict[msg] = { score: 1, messageType: messageType }

  dictKeys.forEach((key) => {
    const similarity = stringSimilarity.compareTwoStrings(msg, key)
    const baseSpamSimilarity = stringSimilarity.compareTwoStrings(
      getBaseSpam(msg),
      key
    )

    const finalSimilarity =
      similarity > baseSpamSimilarity ? similarity : baseSpamSimilarity

    currentMsgDict[key].score += finalSimilarity
    if (!isSubEmote(emoteCodes)) currentMsgDict[msg].score += finalSimilarity
  })
}

// Pass every received message to the parser
const onMessageHandler = (target, context, msg, self) => {
  // Ignore own messages
  if (self) {
    return
  }

  const messageType = context['message-type']

  // Skip sub emotes
  let emoteCodes = []
  if (context.emotes)
    emoteCodes = Object.keys(context.emotes).map((code) => +code)
  if (msgAuthors.includes(context.username)) return

  // Skip URLs
  const urlMatch = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
  const urlRegex = new RegExp(urlMatch)
  if (msg.match(urlRegex)) return

  // Skip commands
  if (ignoreCharacters.includes(msg[0])) return

  console.log(msg)

  msgAuthors = [...msgAuthors, context.username]

  addMessage(msg, emoteCodes, messageType)
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

const fetchGlobalEmotes = async () => {
  const res = await doRequest('https://api.twitchemotes.com/api/v4/channels/0')
  const resJson = JSON.parse(res)

  globalEmotes = resJson.emotes.map((emote) => emote.id)
}

const main = async () => {
  console.log('Fetching all global emotes')
  await fetchGlobalEmotes()
  console.log('Finished fetching global emotes')

  // Register handlers
  client.on('message', onMessageHandler)
  client.on('connected', onConnectedHandler)

  // Start the client
  client.connect()
}

main()
