import dotenv from 'dotenv'
import tmi from 'tmi.js'
import { Worker } from 'worker_threads'
import stringSimilarity from 'string-similarity'

dotenv.config({ silent: true })

const readInterval = 5000 // in [ms]
const similarityThreshold = 0.8
const repetitionThreshold = 3

let currentMsgDict = {}

const opts = {
  identity: {
    username: process.env.CHANNEL_NAME,
    password: process.env.CLIENT_TOKEN,
  },
  // channels: [process.env.CHANNEL_NAME],
  channels: ['forsen'],
}

const client = new tmi.client(opts)

const produceSpam = async () => {
  console.log('Interval started')
  await new Promise((resolve) => setTimeout(resolve, readInterval))
  console.log('Interval passed')

  let mostPopularSpam = null

  if (currentMsgDict !== {})
    mostPopularSpam = Object.entries(currentMsgDict)
      .filter((entry) => entry[1] > repetitionThreshold)
      .sort((a, b) => b[1] - a[1])[0]
  console.log(mostPopularSpam)

  currentMsgDict = {}
  produceSpam()
}

const incrementOrAdd = (msg) => {
  let similarityDict = {}

  const dictKeys = Object.keys(currentMsgDict)
  let bestMatch = ''

  if (dictKeys.length > 0)
    bestMatch = stringSimilarity.findBestMatch(msg, dictKeys).bestMatch
  if (bestMatch.target && bestMatch.rating >= similarityThreshold)
    currentMsgDict[bestMatch.target] += 1
  else currentMsgDict[msg] = 1
}

const onMessageHandler = (target, context, msg, self) => {
  if (self) {
    return
  }

  const currentTimestamp = context['tmi-sent-ts']

  incrementOrAdd(msg.toString())
  // client.say(process.env.CHANNEL_NAME, 'bruh')
}

const onConnectedHandler = (addr, port) => {
  console.log(`* Connected to ${addr}:${port}`)
  console.log('* Starting the spambot')
  produceSpam()
}

client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)

client.connect()
