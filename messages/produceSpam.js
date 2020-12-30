import config from '../config/config.js'
import { sayInChannel } from '../messages/sayInChannel.js'
import { sleep } from '../utils/sleep.js'

export const produceSpam = async (client, currentMsgDict, msgAuthors) => {
  // During the wait we gather messages to the dictionary
  await sleep(config.readInterval + Math.random() * (config.readInterval / 10))

  let mostPopularSpam

  console.log(msgAuthors)

  // Filter out only messages that meet the given threshold, then sort by usage
  if (currentMsgDict !== {})
    mostPopularSpam = Object.entries(currentMsgDict)
      .filter((entry) => entry[1].score >= config.repetitionThreshold)
      .sort((a, b) => b[1].score - a[1].score)[0]

  if (mostPopularSpam) {
    const currentDate = new Date()
    const currentDateFormatted = currentDate.toLocaleTimeString('pl-PL')
    console.log(
      `[${currentDateFormatted}, #${
        config.channelName
      }, score: ${mostPopularSpam[1].score.toFixed(2)}]: ${mostPopularSpam[0]}`
    )

    const messageType = mostPopularSpam[1].messageType

    if (messageType === 'chat') sayInChannel(client, mostPopularSpam[0])
    else if (messageType === 'action')
      sayInChannel(client, `/me ${mostPopularSpam[0]}`) // /me changes the message color to your nickname's color

    // Sleep for some time to not spam too hard
    await sleep(
      config.sleepInterval + Math.random() * (config.sleepInterval / 10)
    )
  }

  // Clear without losing reference
  for (var variableKey in currentMsgDict)
    if (currentMsgDict.hasOwnProperty(variableKey))
      delete currentMsgDict[variableKey]
  // msgAuthors.length = 0

  produceSpam(client, currentMsgDict, msgAuthors) // The spam never ends
}
