import { emotesURI } from './../utils/constants'
import toChannelInfo from '../utils/parseTypes/toChannelInfo'
import axios from 'axios'

export const fetchGlobalEmotes = async (): Promise<number[]> | never => {
  const res = await axios.get(`${emotesURI}/0`)

  if (res.data) {
    const resJson = toChannelInfo(res.data)
    return resJson.emotes.map((emote) => emote.id)
  } else {
    throw Error('Could not fetch global emotes')
  }
}
