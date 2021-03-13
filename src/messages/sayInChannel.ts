import { MessageType } from './../types'
import { logMessage } from './../utils/logMessage'
import { handleCatch } from './../utils/handleCatch'
import config from '../config'
import { client } from '../index'

let prevTimestamp = 0
let prevMsg: string | undefined

export const sayInChannel = async (
  msg: string,
  score?: number,
  messageType?: MessageType
): Promise<void> => {
  if (!score || !messageType) {
    await client.say(config.channelName, msg)
  } else {
    if (Math.floor(Date.now()) - prevTimestamp > config.sleepInterval) {
      try {
        prevTimestamp = Math.floor(Date.now())

        logMessage(msg, score)

        if (msg === prevMsg) {
          msg += ' 󠀀'
          prevMsg = undefined
        } else {
          prevMsg = msg
        }

        // /me changes the message color to your nickname's color
        if (messageType === 'action')
          await client.say(config.channelName, `/me ${msg}`)
        else await client.say(config.channelName, msg)
      } catch (e) {
        handleCatch('Exception while printing to the channel', e)
      }
    }
  }
}
