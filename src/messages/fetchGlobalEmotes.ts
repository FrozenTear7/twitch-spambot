import { isString } from './../utils/parseTypes/typeChecks'
import { emotesURI } from './../utils/constants'
import { doRequest } from '../utils/doRequest'
import toChannelInfo from '../utils/parseTypes/toChannelInfo'

export const fetchGlobalEmotes = async (): Promise<number[]> | never => {
  const res = await doRequest(`${emotesURI}/0`)

  if (isString(res)) {
    const resJson = toChannelInfo(JSON.parse(res))
    return resJson.emotes.map((emote) => emote.id)
  } else {
    throw Error('Could not fetch global emotes')
  }
}
