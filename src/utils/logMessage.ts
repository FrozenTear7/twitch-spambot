import config from '../config'

export const logMessage = (msg: string, score: number): void => {
  const currentDate = new Date()
  const currentDateFormatted = currentDate.toLocaleTimeString('pl-PL')
  console.log(
    `[${currentDateFormatted}, #${config.channelName}, score: ${score.toFixed(
      2
    )}]: ${msg}`
  )
}
