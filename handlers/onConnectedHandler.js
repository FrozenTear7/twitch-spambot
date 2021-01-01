import { produceSpam } from '../messages/produceSpam'

let alreadyConnected = false

export const onConnectedHandler = (client, currentMsgDict, msgAuthors) => {
  return (addr, port) => {
    console.log(`* Connected to ${addr}:${port}`)

    if (!alreadyConnected) {
      alreadyConnected = true
      console.log('* Starting the spambot')

      // Start the spam once connected
      produceSpam(client, currentMsgDict, msgAuthors)
    }
  }
}
