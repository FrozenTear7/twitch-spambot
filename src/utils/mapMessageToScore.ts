import { MessageData } from '../types'
import { calculateScore } from './calculateScore'

export const mapMessageToScore = (
  msg: string,
  currentMessages: MessageData[]
): {
  message: string
  score: number
} => {
  return {
    message: msg,
    score: calculateScore(msg, currentMessages),
  }
}
