// URIs
export const globalEmotesURI = 'https://api.twitch.tv/helix/chat/emotes/global'
export const channelEmotesURI = 'https://api.twitch.tv/helix/chat/emotes'

// To ignore
export const ignoreCharacters = ['+', '!', '@', '#', '$', '%', '^', '&', '*'] // Ignore commands, whispers, etc.

// RegExps
export const multispamRegex = /^.+ (\d+|\d+\/\d+)\s*$/gi // For things like copypastas with counters 'copypasta 1', 'copypasta 2' or 'copypasta 2/5'
export const urlRegex =
  /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)?/gi

// Other consts
export const cooldownTime = 30001
