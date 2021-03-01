import config from '../config'
import colors from 'colors'

export const logMessage = (msg: string, score: number): void => {
  const currentDate = new Date()
  const currentDateFormatted = currentDate.toLocaleTimeString('pl-PL')
  console.log(
    `[${currentDateFormatted}, #${config.channelName}, score: ${colors.green(
      score.toFixed(2)
    )}]: ${colors.yellow(msg)}`
  )
}
