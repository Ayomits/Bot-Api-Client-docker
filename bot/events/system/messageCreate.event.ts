import { Events, Message } from "discord.js";
import Event from "../../libs/structures/commands/event.structure";
import { PrefixCommandHandlerService } from "./services/prefixCommandHandler.service";

export class MessageCreate extends Event {
  name: string

  constructor (private readonly prefixCommandHandlerService: PrefixCommandHandlerService = new PrefixCommandHandlerService()) {
    super()
    this.name = Events.MessageCreate
  }

  async execute(message: Message): Promise<any> {
    return this.prefixCommandHandlerService.main(message)
  }
}