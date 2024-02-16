import { Events, Message } from "discord.js";
import Event from "../../libs/structures/commands/event.structure";
import { ReactionsService } from "./services/reaction.service";

export default class MessageCreate extends Event {
  name: string = Events.MessageCreate
  once: boolean = false

  async execute(message: Message) {
    if (!message.content.startsWith(process.env.PREFIX || ".")) {
      return
    }
    const reactionService = new ReactionsService()
    await reactionService.main(message)
    
  }
}