import { emotesURI } from './../utils/constants'
import toChannelInfo from '../utils/parseTypes/toChannelInfo'
import axios from 'axios'

export const fetchWhitelistedEmotes = async (
  channels: string[]
): Promise<number[]> | never => {
  let result: number[] = []

  if (channels.length > 0) {
    for (const channelId of channels) {
      const res = await axios.get(`${emotesURI}/${channelId}`)

      if (res.data) {
        const resJson = toChannelInfo(res.data)
        result = [...result, ...resJson.emotes.map((emote) => emote.id)]
      } else {
        throw Error(
          `Could not fetch whitelisted emotes for channel: ${channelId}`
        )
      }
    }
  }

  return result
}
