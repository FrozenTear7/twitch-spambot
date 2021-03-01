import colors from 'colors'

export const onNoticeHandler = (
  _channel: string,
  noticeType: string,
  noticeMsg: string
): void => {
  console.log(colors.dim(colors.cyan(`Received notice: ${noticeType}`)))

  switch (noticeType) {
    case 'msg_channel_suspended':
    case 'msg_banned':
    case 'msg_followersonly':
      console.log(colors.red(`Exception during execution: ${noticeMsg}`))
      process.exit(0)
    case 'msg_timedout':
    case 'msg_ratelimit':
    case 'msg_duplicate':
    case 'msg_subsonly':
      console.log(colors.dim(noticeMsg))
      break
    case 'host_target_went_offline':
      console.log(colors.dim('Stream ended, stopping the spam'))
      process.exit(0)
    default:
      console.log(
        colors.red(`Unhandled notice of type: ${noticeType} - ${noticeMsg}`)
      )
      console.log(
        colors.red(
          'Address this in the Issues on Github if something important breaks here'
        )
      )
  }
}
