import { channelEmotesURI, globalEmotesURI } from '../utils/constants'
import toChannelInfo from '../utils/parseTypes/toChannelInfo'
import axios from 'axios'
import config from '../config'

export const fetchGlobalEmotes = async (): Promise<string[]> | never => {
  const res = await axios.get(globalEmotesURI, {
    headers: {
      Authorization: `Bearer ${config.CLIENT_TOKEN}`,
      'Client-Id': config.CLIENT_ID,
    },
  })

  if (res.data) {
    const resJson = toChannelInfo(res.data)
    return resJson.data.map(({ id }) => id)
  } else {
    throw new Error(`Could not fetch global emotes`)
  }
}

export const fetchChannelEmotes = async (
  channelId: string
): Promise<string[]> | never => {
  const res = await axios.get(
    `${channelEmotesURI}?broadcaster_id=${channelId}`,
    {
      headers: {
        Authorization: `Bearer ${config.CLIENT_TOKEN}`,
        'Client-Id': config.CLIENT_ID,
      },
    }
  )

  if (res.data) {
    const resJson = toChannelInfo(res.data)
    return resJson.data.map(({ id }) => id)
  } else {
    throw new Error(`Could not fetch emotes for channel: ${channelId}`)
  }
}
