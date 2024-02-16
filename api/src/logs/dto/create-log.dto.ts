import { ChatLogsType, EconomyLogsType, ModLogsType, VoiceLogsType } from "../utils/types"

export class CreateLogDto {
  guildId: string

  chat: ChatLogsType | null

  voice: VoiceLogsType | null

  mod: ModLogsType | null

  economy: EconomyLogsType | null
}

export class CreateChatLogDto {
  messageDelete: string | null
  messageUpdate: string | null
}

export class CreateVoiceLogDto {}
