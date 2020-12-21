import { doRequest } from './doRequest'

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

export const getAllowedEmotes = async (whitelistChannels) => {
  const globalEmotes = await fetchGlobalEmotes()
  const whitelistedEmotes = await fetchWhitelistedEmotes(whitelistChannels)

  return [...globalEmotes, ...whitelistedEmotes]
}

export const isSubEmote = (globalEmotes, emoteCodes) => {
  return (
    emoteCodes.length !== 0 &&
    emoteCodes.filter((code) => !globalEmotes.includes(code)).length !== 0
  )
}
