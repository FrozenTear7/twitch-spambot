export interface Emote {
  id: string
  name: string
}

export interface ChannelInfo {
  data: Emote[]
}

export type MessageType = 'chat' | 'action' | 'whisper' | undefined

export interface MessageData {
  message: string
  messageType: MessageType
  author?: string
  timestamp: number
  emoteCodes: string[]
}
