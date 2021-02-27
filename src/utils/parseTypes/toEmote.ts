/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isString, isNumber, exists } from './typeChecks'
import { Emote } from './../../types'

const toEmote = (object: any): Emote => {
  return {
    code: parseCode(object.code),
    emoticon_set: parseEmoticonSet(object.emoticon_set),
    id: parseId(object.id),
  }
}

// Parsers

const parseCode = (code: any): string => {
  if (!exists(code) || !isString(code)) {
    throw new Error('Incorrect or missing parameter: code')
  }
  return code
}

const parseEmoticonSet = (emoticonSet: any): number => {
  if (!exists(emoticonSet) || !isNumber(emoticonSet)) {
    throw new Error('Incorrect or missing parameter: emoticon_set')
  }
  return emoticonSet
}

const parseId = (id: any): number => {
  if (!exists(id) || !isNumber(id)) {
    throw new Error('Incorrect or missing parameter: id')
  }
  return id
}

export default toEmote
