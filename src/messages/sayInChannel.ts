import config from '../config/config'
import { client } from '../index'

export const sayInChannel = (msg: string) => {
  client
    .say(config.channelName, msg)
    .catch((e) => console.log(`Exception while printing to the channel: ${e}`))
}
