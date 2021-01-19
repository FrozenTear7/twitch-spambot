import config from '../config/config.js'

export const sayInChannel = (client, msg) => {
  client
    .say(config.channelName, msg)
    .catch((e) => console.log(`Exception while printing to the channel: ${e}`))
}
