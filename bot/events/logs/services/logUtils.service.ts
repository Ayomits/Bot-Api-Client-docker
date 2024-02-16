// import { EmbedBuilder, Guild } from "discord.js";
// import { Logs } from "../../../models/logs";

// export class LogUtilsService {
//   public async sendToLogChannel(
//     guild: Guild,
//     embed: EmbedBuilder,
//     typeOfLog: string
//   ) {
    
//     const channelID = await this.getLogChannel(String(guild.id), typeOfLog);
//     const channel: any = guild?.channels.cache.get(channelID);
    
//     return channel ? await channel.send({ embeds: [embed] }) : false;
//   }

//   public async getLogChannel( // в будущем метод будет посылать запрос на API и получать канал
//     guildID: string,
//     field: string
//   ): Promise<any | null> {
//     const chatChannels = await Logs.findOne({ guildID: guildID }).lean();
    
//     if (chatChannels) {
//       return (chatChannels as any)[field];
//     } else {
//       return null;
//     }
//   }
// }