import { Message } from "discord.js";

export class PrefixCommandHandlerService {
  async main(message: Message) {
    const prefix = await this.getPrefix();
    if (!prefix) {
      return;
    }

    if (message.content.startsWith(prefix)) {
      const splitedMessage = message.content.replace(prefix, "").split(" ");
      const commandName = splitedMessage[0];
      const command = message.client.prefixCommands?.get(commandName);
      if (!command) {
        return;
      }

      const args = splitedMessage.slice(1);

      if (args.length !== command.args.length) {
        return;
      }

      return await command.execute(message, args);
    }
  }

  private async getPrefix(): Promise<string | null | undefined> {
    return process.env.PREFIX; // это временно, в будущем будет эндпоинт в API
  }
}
