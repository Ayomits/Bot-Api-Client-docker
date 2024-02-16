import { Column, Entity, PrimaryColumn } from "typeorm";
import { ChatLogsType, EconomyLogsType, ModLogsType, VoiceLogsType } from "../utils/types";

@Entity('logs_settings')
export class LogSettingsEntity {

  @PrimaryColumn()
  guildId: string

  @Column({type: "json"})
  chat: ChatLogsType

  @Column({type: "json"})
  voice: VoiceLogsType

  @Column({type: "json"})
  economy: EconomyLogsType

  @Column({type: "json"})
  mod: ModLogsType
}

// maybe later i will add more fields here
