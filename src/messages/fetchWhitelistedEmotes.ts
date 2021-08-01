import { fetchEmotes } from './fetchEmotes'

export const fetchWhitelistedEmotes = async (
  channels: string[]
): Promise<string[]> | never => {
  let result: string[] = []

  if (channels.length > 0) {
    for (const channelId of channels) {
      const channelEmotes = await fetchEmotes(channelId)
      result = [...result, ...channelEmotes]
    }
  }

  return result
}
