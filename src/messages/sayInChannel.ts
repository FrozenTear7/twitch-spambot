import config from '../config'
import { client } from '../index'

export const sayInChannel = (msg: string): void => {
  client
    .say(config.channelName, msg)
    .catch((e) =>
      console.log(`Exception while printing to the channel: ${e as string}`)
    )
}
