import { produceSpam } from '../messages/produceSpam'

export const onConnectedHandler = (client, currentMsgDict, msgAuthors) => {
  return (addr, port) => {
    console.log(`* Connected to ${addr}:${port}`)
    console.log('* Starting the spambot')

    // Start the spam once connected
    produceSpam(client, currentMsgDict, msgAuthors)
  }
}
