export interface Emote {
  code: string
  emoticon_set: number
  id: number
}

export interface ChannelInfo {
  emotes: Emote[]
}

export type MessageType = 'chat' | 'action' | 'whisper' | undefined

export interface MessageData {
  message: string
  messageType: MessageType
  author?: string
  timestamp: number
  emoteCodes: number[]
}
