// import { Events, Message, PartialMessage } from "discord.js";
// import Event from "../../libs/structures/commands/event.structure";
// import { MessageLogService } from "./services/messageLog.service";

// export default class LogMessageUpdate extends Event {
//   name: string;

//   constructor(
//     private readonly messageLogService: MessageLogService = new MessageLogService()
//   ) {
//     super();
//     this.name = Events.MessageUpdate;
//   }

//   async execute(
//     oldMessage: Message | PartialMessage,
//     newMessage: Message | PartialMessage
//   ): Promise<void> {
//     await this.messageLogService.messageUpdate(oldMessage, newMessage);
//   }
// }
