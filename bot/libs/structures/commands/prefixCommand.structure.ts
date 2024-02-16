import { Client, Message } from "discord.js";
import { IPrefixCommand } from "../../../base.types";


export abstract class PrefixCommand {
    readonly name: string; // имя команды
    readonly requiredUserPermissions: string[]; // права для юзера
    readonly requiredGuildPemissions: string[]; // права для гильдии
    readonly args: string[]

    constructor(options: IPrefixCommand) {
      this.name = options.name;
      this.requiredUserPermissions = options.requiredUserPermissions;
      this.requiredGuildPemissions = options.requiredGuildPemissions;
      this.args = options.args
    }

    abstract execute(message: Message): any; // метод, котоорый вызывается при обработке команды в ХЕНДЛЕРЕ
}