import { isString } from './../utils/parseTypes/typeChecks'
import { emotesURI } from './../utils/constants'
import toChannelInfo from '../utils/parseTypes/toChannelInfo'
import { doRequest } from './../utils/doRequest'

export const fetchWhitelistedEmotes = async (
  channels: string[]
): Promise<number[]> | never => {
  let result: number[] = []

  if (channels.length > 0) {
    for (const channelId of channels) {
      const res = await doRequest(`${emotesURI}/${channelId}`)

      if (isString(res)) {
        const resJson = toChannelInfo(JSON.parse(res))
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
