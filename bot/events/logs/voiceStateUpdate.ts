// import { Events, VoiceState } from "discord.js";
// import Event from "../../libs/structures/commands/event.structure";
// import { VoiceLogService } from "./services/voiceLog.service";

// export default class LogMessageUpdate extends Event {
//   name: string;

//   constructor(
//     private readonly voiceLogService: VoiceLogService = new VoiceLogService()
//   ) {
//     super();
//     this.name = Events.VoiceStateUpdate;
//   }

//   async execute(oldState: VoiceState, newState: VoiceState): Promise<void> {
//     try {
//       await this.voiceLogService.voiceStateUpdate(oldState, newState);
//     }catch (err) {}
//   }
// }
