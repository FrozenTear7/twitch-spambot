import config from '../config'
import { client } from '../index'
import colors from 'colors'

export const sayInChannel = async (msg: string): Promise<void> => {
  try {
    await client.say(config.channelName, msg)
  } catch (e) {
    console.log(
      colors.red(
        `Exception while printing to the channel: ${(e as Error).message}`
      )
    )
  }
}
