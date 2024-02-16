import { LogSettingsEntity } from "../entities/log.entity"


// This types needed for complex api work
export type ChatLogsType = {
  messageDelete: string | null,
  messageUpdate: string | null,
}

export type VoiceLogsType = {
  connect: string | null,
  disconnect: string | null,
  move: string | null,
  stream: string | null
}

export type EconomyLogsType = {
  transfer: string | null, // for /transfer command
  give: string | null, // for /give command
}

export type ModLogsType = {
  warn: string | null,
  mutes: string | null,
  bans: string | null,
}


export type ChatResponseType = LogSettingsEntity.chat

export type VoiceResponseType = LogSettingsEntity.voice

export type ModResponseType = LogSettingsEntity.mod

export type AllSettingsResponseType = LogSettingsEntity

export type AnyResponseType = AllSettingsResponseType | ChatResponseType | VoiceResponseType | ModResponseType | null

export type SettingsResponseType = {"settings": AnyResponseType}
