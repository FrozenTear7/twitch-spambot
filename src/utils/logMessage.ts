import config from '../config/config'

export const logMessage = (msg: string, score: number) => {
  const currentDate = new Date()
  const currentDateFormatted = currentDate.toLocaleTimeString('pl-PL')
  console.log(
    `[${currentDateFormatted}, #${config.channelName}, score: ${score.toFixed(
      2
    )}]: ${msg}`
  )
}
