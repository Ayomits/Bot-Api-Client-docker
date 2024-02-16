import { Events } from "discord.js";
import Event from "../../libs/structures/commands/event.structure";

export default class GuildMemberAdd extends Event {
  name: string = Events.GuildMemberAdd;

  async execute() {}
}