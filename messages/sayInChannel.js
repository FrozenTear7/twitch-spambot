import config from '../config/config.js'

export const sayInChannel = (client, msg) => {
  try {
    client.say(config.channelName, msg)
  } catch (e) {
    console.log(`Exception while printing to the channel: ${e}`)
  }
}
