import { sayInChannel } from './../messages/sayInChannel'
import config from '../config'

export const autoResponse = async (
  msg: string,
  author?: string
): Promise<void> => {
  console.log(config)
  console.log(config.mentionResponse)
  if (
    config.mentionResponse &&
    msg.toLowerCase().includes(config.TWITCH_USERNAME.toLowerCase()) &&
    author
  ) {
    await sayInChannel(config.mentionResponse)

    return new Promise((resolve) =>
      setTimeout(
        resolve,
        2000 + Math.floor(Math.random() * 2001) // Act like a human and randomize the response time
      )
    )
  } else {
    return new Promise((resolve) => resolve)
  }
}
