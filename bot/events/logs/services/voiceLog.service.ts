// import { EmbedBuilder, GuildAuditLogs, VoiceState } from "discord.js";
// import { LogUtilsService } from "./logUtils.service";


// export class VoiceLogService {
//   constructor(
//     private readonly utils: LogUtilsService = new LogUtilsService()
//   ) {}
  
//   // Просто обычная функция, а не Array.prototype
//   // Используется 1 раз и всего в 1 кусочке кода!
//   // Эхх :)
//   // Пишу уже этот комментарий в 20:27 14.01.2024 
//   // Я сейчас осознал насолько же много кодовой базы и мне это надо переписывать
//   // Я хз когда проходит это ревью и проходит ли оно вообще
//   // Но я бы хотел верить, что я не останусь обманут и мои идеи, а также подходы не в помойку отправятся
//   private arrayEquals(a: any[], b: any[]): boolean {
//     if (!a || !b) return false;
//     if (a === b) return true;
//     if (a.length !== b.length) return false;
  
//     for (let i = 0; i < a.length; i++) {
//       if (Array.isArray(a[i]) && Array.isArray(b[i])) {
//         if (!this.arrayEquals(a[i], b[i])) {
//           return false;
//         }
//       } else if (a[i] !== b[i]) {
//         return false;
//       }
//     }
//     return true;
//   }

//   // Почему именно oldState и newState. Потому что в доках !!

//   // та часть на которой я больше всего встрял
//   // Декомпозировать было тяжко и я хотел улучшить качество самого кода
//   // Т.е. работать он работает, а качество было какое-то ну да
//   // В общем такой вариант :)

//   // ЕСЛИ ПИШЕШЬ В camelCase, то пожалуйста пиши так везде, а не где-то camelCase, а где-то under_score

//   // эта функция теперь является Контроллером
//   public async voiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
//     const isConnected = oldState.channelId == null;
//     const isDisconnected =
//       oldState.channelId != null && newState.channelId == null;
//     const isMoved =
//       oldState.channelId != null &&
//       newState.channelId != null &&
//       oldState.channelId != newState.channelId;
//     const auditCache = newState.client.auditCache?.get(
//       newState.guild.id
//     ) as GuildAuditLogs<any>;
//     const fetchAuditLogs = (await oldState.guild
//       .fetchAuditLogs({
//         limit: 50,
//       })
//       .catch(console.error)) as GuildAuditLogs<any>;

//     newState.client.auditCache?.set(newState.guild.id, fetchAuditLogs);
//     if (isConnected) {
//       // для коннектов
//       await this.isConnectedService(newState);
//     } else if (isDisconnected) {
//       // для отключений
//       await this.isDisconnectedService(oldState, fetchAuditLogs, auditCache);
//     } else if (isMoved) {
//       // для перемещений
//       await this.isMovedService(oldState, newState, fetchAuditLogs, auditCache);
//     } else {
//       // для стримов, отключений микрофона и т.п.
//       await this.checkActivities(oldState, newState, fetchAuditLogs);
//     }
//   }

//   // Теперь эти функции являются сервисами для функции выше!
//   // Private говорит о том, что она доступна только внутри класса
//   private async isConnectedService(newState: VoiceState) {
//     const userAvatar = newState.member
//       ? newState.member.displayAvatarURL()
//       : null;
//     const embed = new EmbedBuilder()
//       .setTimestamp()
//       .setThumbnail(userAvatar)
//       .setColor("Green")
//       .setTitle(`Присоединение к войсу`)
//       .setDescription(`${newState.member} подключился к каналу`)
//       .setFields({
//         name: `Канал`,
//         value: `**\`${newState.channel?.name}\`**`,
//         inline: true,
//       });

//     await this.utils.sendToLogChannel(newState.guild, embed, "voice");
//   }

//   private async isDisconnectedService(
//     oldState: VoiceState,
//     fetchedLogs: GuildAuditLogs<any>,
//     auditCache: GuildAuditLogs<any>
//   ) {
//     const userAvatar = oldState.member
//       ? oldState.member.displayAvatarURL()
//       : null;
//     const disconnectLogs = await this.findLogs(fetchedLogs, 27, auditCache);
//     const embed = new EmbedBuilder()
//       .setTimestamp()
//       .setThumbnail(userAvatar)
//       .setColor("Red")
//       .setFields({
//         name: `Канал`,
//         value: `**\`${oldState.channel?.name}\`**`,
//         inline: true,
//       });

//     if (!disconnectLogs[1]) {
//       embed.setTitle(`Отключение от войса [Принудительное]`);
//       embed.setDescription(
//         `${disconnectLogs[0]} отключил ${oldState.member} от канала`
//       );
//     } else {
//       embed.setTitle(`Отключение от войса`);
//       embed.setDescription(`${oldState.member} отключился от канала`);
//     }

//     return await this.utils.sendToLogChannel(oldState.guild, embed, "voice");
//   }

//   private async isMovedService(
//     oldState: VoiceState,
//     newState: VoiceState,
//     fetchedLogs: GuildAuditLogs<any>,
//     auditCache: GuildAuditLogs<any>
//   ) {
//     const userAvatar = oldState.member
//       ? oldState.member.displayAvatarURL()
//       : null;
//     const logs = await this.findLogs(fetchedLogs, 27, auditCache);
//     const embed = new EmbedBuilder()
//       .setTimestamp()
//       .setThumbnail(userAvatar)
//       .setColor("Blue")
//       .setFields(
//         {
//           name: `Предыдущий канал`,
//           value: `**\`${oldState.channel?.name}\`**`,
//           inline: true,
//         },
//         {
//           name: `Нынешний канал`,
//           value: `**\`${newState.channel?.name}\`**`,
//           inline: true,
//         }
//       );

//     if (!logs[1]) {
//       embed.setTitle(`Перемещение между войсами [Принудительное]`);
//       embed.setDescription(`${logs[0]} переместил ${oldState.member}`);
//     } else {
//       embed.setTitle(`Перемещение между войсами`);
//       embed.setDescription(`${oldState.member} перешел в другой канал`);
//     }

//     await this.utils.sendToLogChannel(newState.guild, embed, "voice");
//   }

//   private async findLogs(
//     fetchedLogs: GuildAuditLogs<any>,
//     type_: number,
//     auditCache: GuildAuditLogs<any>
//   ): Promise<any> {
//     const findLogs_ = fetchedLogs.entries?.find((a) => a.action === type_);
//     const cachedLogs = auditCache?.entries
//       .filter((e: any) => e.action === 27)
//       .map((e: any) => e.extra?.count)
//       .slice(0, fetchedLogs.entries.filter((e: any) => e.action === 27).size);
//     const this_disconnect_count = fetchedLogs?.entries
//       .filter((e: any) => e.action === 27)
//       .map((e: any) => e.extra?.count);

//     const adminLogs = this.arrayEquals(cachedLogs, this_disconnect_count);

//     return [findLogs_?.executor, adminLogs];
//   }


//   // Моя моральная боль, но по факту, функция исполняет задачи, которые её заложены, а именно чекать активки и выдавать эмбед
//   // Первая правка была связана channel.send() - который везде одинаков
//   // Вторая правка была связана с embed.setTitle() и embed.setDescription()  
//   private async checkActivities(
//     oldState: VoiceState,
//     newState: VoiceState,
//     fetchedLogs: GuildAuditLogs<any>
//   ) {
//     const isSelfMute = oldState.selfMute != newState.selfMute;
//     const isSelfDeaf = oldState.selfDeaf != newState.selfDeaf;
//     const isServerMute = oldState.serverMute != newState.serverMute;
//     const isServerDeaf = oldState.serverDeaf != newState.serverDeaf;
//     const isSelfVideo = oldState.selfVideo != newState.selfVideo;
//     const isStreaming = oldState.streaming != newState.streaming;

//     const findLog = fetchedLogs.entries.find((a) => a.action == 24);

//     const userAvatar = oldState.member
//       ? oldState.member.displayAvatarURL()
//       : null;

//     const embed = new EmbedBuilder()
//       .setTimestamp()
//       .setThumbnail(userAvatar)
//       .setColor("Blue")
//       .setFields({
//         name: `Канал`,
//         value: `**\`${newState.channel?.name}\`**`,
//         inline: true,
//       });

//     let title: string = "";
//     let description: string = "";

//     if (isSelfMute && !isSelfDeaf) {
//       title += `Отключение микрофона`;
//       description += `${oldState.member} ${newState.selfMute ? "отключил" : "включил"} микрофон`;
//     } else if (isServerMute) {
//       title += `Отключение микрофона [Принудительное]`;
//       description += `${findLog?.executor} ${newState.serverMute ? "отключил" : "включил"} микрофон ${oldState.member}`;
//     } else if (isSelfDeaf) {
//       title += `Отключение звука`;
//       description += `${oldState.member} ${newState.selfDeaf ? "отключил" : "включил"} звук`;
//     } else if (isServerDeaf) {
//       title += `Отключение звука [Принудительное]`;
//       description += `${findLog?.executor} ${newState.serverDeaf ? "отключил" : "включил"} звук ${oldState.member}`;
//     } else if (isSelfVideo) {
//       title += `Включение/Выключение камеры`;
//       description += `${oldState.member} ${newState.selfVideo ? "включил" : "отключил"} камеру`;
//     } else if (isStreaming) {
//       title += `Включение/Выключение демонстрации экрана`;
//       description += `${oldState.member} ${newState.streaming ? "включил" : "отключил"} демонстрацию экрана`;
//     }
//     await this.utils.sendToLogChannel(newState.guild, embed.setTitle(title).setDescription(description), "voice");
//   }
// }