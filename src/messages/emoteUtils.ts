import { emotesURI } from './../utils/constants'
import { isString } from './../utils/parseTypes/typeChecks'
import { doRequest } from '../utils/doRequest'
import toChannelInfo from '../utils/parseTypes/toChannelInfo'

const fetchGlobalEmotes = async () => {
  const res = await doRequest(`${emotesURI}/0`)

  if (isString(res)) {
    const resJson = toChannelInfo(JSON.parse(res))
    return resJson.emotes.map((emote) => emote.id)
  } else {
    throw Error('Could not fetch global emotes')
  }
}

const fetchWhitelistedEmotes = async (channels: string[]) => {
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

// Allow all global Twitch emotes available for everyone and the channels you're subbed to (from whitelistEmotes.json)
export const getAllowedEmotes = async (
  whitelistChannels: string[]
): Promise<number[]> => {
  const globalEmotes = await fetchGlobalEmotes()
  const whitelistedEmotes = await fetchWhitelistedEmotes(whitelistChannels)

  return [...globalEmotes, ...whitelistedEmotes]
}

// Check if message contains any sub emotes (except for the channels you're subbed to)
export const hasSubEmotes = (
  allowedEmotes: number[],
  emoteCodes: number[]
): boolean => {
  return (
    emoteCodes.length !== 0 &&
    emoteCodes.filter((code) => !allowedEmotes.includes(code)).length !== 0
  )
}
