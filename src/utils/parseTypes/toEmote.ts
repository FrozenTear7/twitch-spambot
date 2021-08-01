/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { isString, exists } from './typeChecks'
import { Emote } from './../../types'

const toEmote = (object: any): Emote => {
  return {
    id: parseId(object.id),
    name: parseName(object.name),
  }
}

// Parsers

const parseId = (id: any): string => {
  if (!exists(id) || !isString(id)) {
    throw new Error('Incorrect or missing parameter: id')
  }
  return id
}

const parseName = (name: any): string => {
  if (!exists(name) || !isString(name)) {
    throw new Error('Incorrect or missing parameter: name')
  }
  return name
}

export default toEmote
