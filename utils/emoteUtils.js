import { doRequest } from './doRequest'

export const fetchGlobalEmotes = async (emotesURI) => {
  const res = await doRequest(emotesURI)
  const resJson = JSON.parse(res)

  return resJson.emotes.map((emote) => emote.id)
}

export const isSubEmote = (globalEmotes, emoteCodes) => {
  return (
    emoteCodes.length !== 0 &&
    emoteCodes.filter((code) => !globalEmotes.includes(code)).length !== 0
  )
}
