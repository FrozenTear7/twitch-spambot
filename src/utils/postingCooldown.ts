import { cooldownTime } from './constants'

export const postingCooldown = (
  msg: string,
  prevMsg: string,
  prevTimestamp: number
) =>
  Math.floor(Date.now()) - prevTimestamp > cooldownTime // If an identical message was sent 30s ago ignore the duplicates
    ? true
    : msg != prevMsg
