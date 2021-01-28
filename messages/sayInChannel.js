import config from '../config/config.js'
import { client } from '../index.js'

export const sayInChannel = (msg) => {
  client
    .say(config.channelName, msg)
    .catch((e) => console.log(`Exception while printing to the channel: ${e}`))
}
