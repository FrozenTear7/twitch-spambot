/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isArray, exists } from './typeChecks'
import { ChannelInfo, Emote } from './../../types'
import toEmote from './toEmote'

const toChannelInfo = (object: any): ChannelInfo => {
  return {
    data: parseData(object.data),
  }
}

// Parsers

const parseData = (data: any): Emote[] => {
  if (!exists(data) || !isArray(data)) {
    throw new Error('Incorrect or missing parameter: data')
  }
  return data.map((x: any) => toEmote(x)) as Emote[]
}

export default toChannelInfo
