import { produceSpam } from '../messages/produceSpam'

let connections = 0

export const onConnectedHandler = (client, currentMsgDict, msgAuthors) => {
  return (addr, port) => {
    console.log(`* Connected to ${addr}:${port}`)
    connections++

    if (connections == 1) {
      console.log('* Starting the spambot')

      // Start the spam once connected
      produceSpam(client, currentMsgDict, msgAuthors)
    }
  }
}
