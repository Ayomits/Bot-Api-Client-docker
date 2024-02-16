import {
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
} from "discord.js";

export default abstract class Component {
  readonly customId;

  constructor(customId: string) {
    this.customId = customId;
  }

  abstract execute(
    interaction:
      | ButtonInteraction
      | ModalSubmitInteraction
      | StringSelectMenuInteraction
      | RoleSelectMenuInteraction
      | ChannelSelectMenuInteraction
  ): any;
} // метод, который вызывается в момент обработки компонента