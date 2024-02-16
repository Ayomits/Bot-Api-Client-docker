import { Events, Interaction } from "discord.js";

import Event from "../../libs/structures/commands/event.structure";
import { SlashCommandHandlerService } from "./services/slashCommandHandler.service";

// хендлер для слэш команд и компонентов
// Interaction распространяется на все виды компонентов

export class InteractionCreate extends Event {
  name: string

  constructor (
    private readonly slashCommandsHandlerService: SlashCommandHandlerService = new SlashCommandHandlerService()
  ) {
    super()
    this.name = Events.InteractionCreate;
  }

  async execute(interaction: Interaction) {
    return this.slashCommandsHandlerService.main(interaction)
  }
}
