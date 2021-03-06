/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArray, exists } from './typeChecks'
import { ChannelInfo, Emote } from './../../types'
import toEmote from './toEmote'

const toChannelInfo = (object: any): ChannelInfo => {
  return {
    emotes: parseEmotes(object.emotes),
  }
}

// Parsers

const parseEmotes = (emotes: any): Emote[] => {
  if (!exists(emotes) || !isArray(emotes)) {
    throw new Error('Incorrect or missing parameter: emotes')
  }
  return emotes.map((x: any) => toEmote(x)) as Emote[]
}

export default toChannelInfo
