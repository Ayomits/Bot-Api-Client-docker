import {
  SlashCommandBuilder,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import SlashCommand from "../../libs/structures/commands/slashCommand.structure";
import { PingService } from "./services/ping.service";

// Implements - реализовать
// extends от implements отличается тем, что первый расширяет возможности, а второй заставляет переписать возможности не допуская расширения

export class Ping extends SlashCommand {
  data = new SlashCommandBuilder()
          .setName("ping")
          .setDescription("Пинг бота");

  async execute(interaction: CommandInteraction) {
    const pingService = new PingService(interaction); // инициализируем наш сервис

    return pingService.generateEmbed(); // возвращаем метод из сервиса
  }
}