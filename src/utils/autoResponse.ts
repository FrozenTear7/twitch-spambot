import { sayInChannel } from './../messages/sayInChannel'
import config from '../config'

export const autoResponse = async (
  msg: string,
  author?: string
): Promise<void> => {
  if (
    config.mentionResponse === 1 &&
    msg.toLowerCase().includes(config.TWITCH_USERNAME.toLowerCase()) &&
    author
  ) {
    await sayInChannel(`@${author} ConcernDoge 👌`)

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
