import { isString } from './../utils/parseTypes/typeChecks'
import config from '../config'
import { client } from '../index'
import colors from 'colors'

export const sayInChannel = async (msg: string): Promise<void> => {
  try {
    await client.say(config.channelName, msg)
  } catch (e) {
    if (e instanceof Error) {
      console.log(
        colors.red(`Exception while printing to the channel: ${e.message}`)
      )
    } else if (isString(e)) {
      console.log(colors.red(`Exception while printing to the channel: ${e}`))
    } else {
      throw e
    }
  }
}
