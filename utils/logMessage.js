import config from '../config/config.js'

export const logMessage = (msg, score) => {
  const currentDate = new Date()
  const currentDateFormatted = currentDate.toLocaleTimeString('pl-PL')
  console.log(
    `[${currentDateFormatted}, #${config.channelName}, score: ${score.toFixed(
      2
    )}]: ${msg}`
  )
}
