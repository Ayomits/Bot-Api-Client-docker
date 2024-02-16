import { Interaction } from "discord.js";

export class SlashCommandHandlerService {
  async main (interaction: Interaction) {
    if (interaction.isCommand()) {
      const command = interaction.client.slashCommands?.get(interaction.commandName);
      try {
        return await command?.execute(interaction);
      } catch (err) {
        console.log(err);
      }
    } else if (
      interaction.isButton() ||
      interaction.isAnySelectMenu() ||
      interaction.isModalSubmit()
    ) {
      const component = interaction.client.buttons?.get(interaction.customId);
      try {
        return component?.execute(interaction);
      } catch (err) {
        console.log(err);
      }
    } else if (interaction.isAutocomplete()) {
      const command = interaction.client.slashCommands?.get(interaction.commandName);
      if (command?.autoComplete) {
        try {
          return await command?.autoComplete(interaction);
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
}