import { emotesURI } from '../utils/constants'
import toChannelInfo from '../utils/parseTypes/toChannelInfo'
import axios from 'axios'
import config from '../config'

export const fetchEmotes = async (
  channelId: string
): Promise<string[]> | never => {
  const res = await axios.get(`${emotesURI}/${channelId}`, {
    headers: {
      Authorization: `Bearer ${config.CLIENT_TOKEN.substr(6)}`,
      'Client-Id': config.CLIENT_ID,
    },
  })

  if (res.data) {
    const resJson = toChannelInfo(res.data)
    return resJson.data.map((emote) => emote.id)
  } else {
    throw new Error(`Could not fetch emotes for channel: ${channelId}`)
  }
}
