import { doRequest } from '../utils/doRequest'

const emotesURI = 'https://api.twitchemotes.com/api/v4/channels'

const fetchGlobalEmotes = async () => {
  const res = await doRequest(`${emotesURI}/0`)
  const resJson = JSON.parse(res)

  return resJson.emotes.map((emote) => emote.id)
}

const fetchWhitelistedEmotes = async (channels) => {
  let result = []

  if (channels.length > 0) {
    for (const channelId of channels) {
      const res = await doRequest(`${emotesURI}/${channelId}`)
      const resJson = JSON.parse(res)

      result = [...result, ...resJson.emotes.map((emote) => emote.id)]
    }
  }

  return result
}

// Allow all global Twitch emotes available for everyone and the channels you're subbed to (from whitelistEmotes.json)
export const getAllowedEmotes = async (whitelistChannels) => {
  const globalEmotes = await fetchGlobalEmotes()
  const whitelistedEmotes = await fetchWhitelistedEmotes(whitelistChannels)

  return [...globalEmotes, ...whitelistedEmotes]
}

// Check if message contains any sub emotes (except for the channels you're subbed to)
export const hasSubEmotes = (allowedEmotes, emoteCodes) => {
  return (
    emoteCodes.length !== 0 &&
    emoteCodes.filter((code) => !allowedEmotes.includes(code)).length !== 0
  )
}
