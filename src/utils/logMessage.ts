import config from '../config'
import colors from 'colors'

export const logMessage = (msg: string, score: number): void => {
  // Add spacing to the score for better readability in the console
  let scoreMsg = score.toFixed(2)
  if (scoreMsg.toString().length === 4) scoreMsg = `  ${scoreMsg}`
  else if (scoreMsg.toString().length === 5) scoreMsg = ` ${scoreMsg}`
  else if (scoreMsg.toString().length > 6) scoreMsg = scoreMsg.substr(0, 6)

  const currentDate = new Date()
  const currentDateFormatted = currentDate.toLocaleTimeString('pl-PL')
  console.log(
    `[${currentDateFormatted}, #${config.channelName}, score: ${colors.green(
      scoreMsg
    )}]: ${colors.yellow(msg)}`
  )
}
