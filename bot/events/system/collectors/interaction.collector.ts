import { Button } from "../../../base.types";
import { Client, Collection } from "discord.js";
import * as path from "path";
import * as fs from "fs";
import { PrefixCommand } from "../../../libs/structures/commands/prefixCommand.structure";
import SlashCommand from "../../../libs/structures/commands/slashCommand.structure";

export default class InteractionCollector extends Collection<string, Button> {
  readonly client: Client;

  constructor(client: Client) {
    super();
    this.client = client;
  }

  public async collect() {
    const pathToInteractions = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "commands"
    );
    const collectedCategoryTags: string[] = ["buttons", "modals", "selects"];

    fs.readdirSync(pathToInteractions).forEach((dir) => {
      const interactionCategoryPath = path.join(pathToInteractions, dir);
      fs.readdirSync(interactionCategoryPath).forEach(async (dir_) => {
        if (collectedCategoryTags.includes(dir_)) {
          await this.componentCollect(interactionCategoryPath, dir_);
        }
        if (dir_.includes("command")) {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          await this.commandCollect(interactionCategoryPath, dir_);
        }
      });
    });
  }

  private async componentCollect(
    interactionCategoryPath: string,
    dir_: string
  ) {
    const interactionPath = path.join(interactionCategoryPath, dir_);
    fs.readdirSync(interactionPath).forEach(async (file) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const ComponentClass = require(interactionPath + `/${file}`);
      const component = new ComponentClass[Object.keys(ComponentClass)[0]]();
      this.client.buttons?.set(component.customId, component);
    });
  }

  private async commandCollect(interactionCategoryPath: string, dir_: string) {
    const CommandClass = require(interactionCategoryPath + `/${dir_}`);
    try {
      const command = new CommandClass[Object.keys(CommandClass)[0]]();
      if (command instanceof PrefixCommand) {
        this.client.prefixCommands?.set(command.name, command);
      } else if (command instanceof SlashCommand) {
        this.client.slashCommands?.set(command.data.name, command);
      }
    } catch (err) {
      return;
    }
  }
}
