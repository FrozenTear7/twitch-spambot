export const onNoticeHandler = (channel, noticeType, noticeMsg) => {
  console.log(`Received notice: ${noticeType}`)

  switch (noticeType) {
    case 'msg_channel_suspended':
    case 'msg_banned':
    case 'msg_followersonly':
      console.log(`Exception during execution: ${noticeMsg}`)
      process.exit(0)
    case 'msg_timedout':
    case 'msg_ratelimit':
    case 'msg_duplicate':
    case 'msg_subsonly':
      console.log(noticeMsg)
      break
    case 'host_target_went_offline':
      console.log('Stream ended, stopping the spam')
      process.exit(0)
    default:
      console.log(`Unhandled notice of type: ${noticeType} - ${noticeMsg}`)
      console.log(
        'Address this in the Issues on Github if something important breaks here'
      )
  }
}
