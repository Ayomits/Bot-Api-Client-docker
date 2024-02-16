// import { Events, Message, PartialMessage } from "discord.js";
// import Event from "../../libs/structures/commands/event.structure";
// import { MessageLogService } from "./services/messageLog.service";

// export default class LogMessageDelete extends Event {
//   name: string;

//   constructor(
//     private readonly messageLogService: MessageLogService = new MessageLogService()
//   ) {
//     super();
//     this.name = Events.MessageDelete;
//   }

//   async execute(message: Message | PartialMessage): Promise<void> {
//     await this.messageLogService.messageDelete(message);
//   }
// }
