import { emotesURI } from '../utils/constants'
import toChannelInfo from '../utils/parseTypes/toChannelInfo'
import axios from 'axios'

export const fetchEmotes = async (
  channelId: string
): Promise<number[]> | never => {
  const res = await axios.get(`${emotesURI}/${channelId}`)

  if (res.data) {
    const resJson = toChannelInfo(res.data)
    return resJson.emotes.map((emote) => emote.id)
  } else {
    throw new Error(`Could not fetch emotes for channel: ${channelId}`)
  }
}
