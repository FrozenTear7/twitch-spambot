const cooldownTime = 30001

export const postingCooldown = (msg, prevMsg, prevTimestamp) =>
  Math.floor(Date.now()) - prevTimestamp > cooldownTime // If an identical message was sent 30s ago ignore the duplicates
    ? true
    : msg != prevMsg
