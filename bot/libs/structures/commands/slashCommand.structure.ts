import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default abstract class SlashCommand {
  readonly data: SlashCommandBuilder;

  constructor(data: SlashCommandBuilder) {
    this.data = data;
  }

  abstract execute(interaction: CommandInteraction): any;
}