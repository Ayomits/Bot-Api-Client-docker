// import {
//   EmbedBuilder,
//   Message,
//   PartialMessage,
// } from "discord.js";
// import { LogUtilsService } from "./logUtils.service";

// // По факту все сервисы тут это код, что был написан тобой и транслированный на лад TypeScript
// // От себя я почти ничего не вкинул : )


// export class MessageLogService {
//   // в конструктор я ставлю utils только за тем, что я хз к чему относятся эти функции, но используются в обоих классах

//   constructor(
//     private readonly utils: LogUtilsService = new LogUtilsService()
//   ) {}

//   public async messageDelete(message: Message | PartialMessage): Promise<any> {
//     if (!message.guild) return;
//     if (!message.author) return;
//     if (message.author.bot) return;

//     const auditEntry = await this.getAudit(message);

//     const embed = new EmbedBuilder()
//       .setColor("Red")
//       .setTitle("🗑️ Удаление сообщения 🗑️")
//       .setTimestamp()
//       .setThumbnail(message.member?.displayAvatarURL() || null)
//       .setFields(
//         { name: "Пользователь", value: `${message.member}`, inline: true },
//         {
//           name: "Удалил",
//           value: `${auditEntry ? auditEntry.executor : message.member}`,
//           inline: true,
//         },
//         { name: "Канал", value: `${message.channel}`, inline: true },
//         {
//           name: "Сообщение",
//           value: `\`\`\`${message.content || "Отсутствует"}\`\`\``,
//           inline: false,
//         }
//       );
//     if (message.attachments?.size != 0)
//       embed.setImage((message as any).attachments.first()?.url);

//     await this.utils.sendToLogChannel(message.guild, embed, "chat");
//   }

//   // Плюс минус уникально, поэтому не стал делать столько же функций, сколько и в войсах
//   // Тут всё удобно и понятно, а в войсе было очень много и нужно было декомпозировать :)

//   // Я хз вообще какое сейчас время. На момент написания этого комментария 14.01.2024 12:47
//   public async messageUpdate(
//     oldMessage: Message | PartialMessage,
//     newMessage: Message | PartialMessage
//   ) {
//     if (!newMessage.guild) return;
//     if (!newMessage.author) return;
//     if (newMessage.author.bot) return;

//     if (oldMessage.content == newMessage.content) return;

//     const embed = new EmbedBuilder()
//       .setColor("Yellow")
//       .setTitle("✏️ Изменение сообщения ✏️")
//       .setTimestamp()
//       .setThumbnail(
//         newMessage.member ? newMessage.member.displayAvatarURL() : null
//       )
//       .setFields(
//         { name: "Пользователь", value: `${newMessage.member}`, inline: true },
//         { name: "Канал", value: `${oldMessage.channel}`, inline: true },
//         {
//           name: "Сообщение",
//           value: `[Перейти к сообщению](https://discord.com/channels/${newMessage.guild?.id}/${newMessage.channel.id}/${newMessage.id})`,
//           inline: true,
//         },
//         {
//           name: "Старое сообщение",
//           value: `\`\`\`${oldMessage.content || "Отсутствует"}\`\`\``,
//           inline: false,
//         },
//         {
//           name: "Новое сообщение",
//           value: `\`\`\`${newMessage.content || "Отсутствует"}\`\`\``,
//           inline: false,
//         }
//       );

//     if (newMessage.attachments) {
//       embed.setImage((newMessage as any).attachments.first()?.url);
//     }

//     await this.utils.sendToLogChannel(newMessage.guild, embed, "chat");
//   }

//   private async getAudit(message: Message | any): Promise<any> {
//     const fetchedLogs = await message.guild
//       .fetchAuditLogs({
//         limit: 50,
//         type: 72,
//       })
//       .catch(console.error);

//     // TypeScript такой вот
//     const auditEntry = fetchedLogs?.entries.find(
//       (a: { target: { id: any }; extra: { channel: { id: any } } }) =>
//         a.target?.id === message.author?.id &&
//         a.extra.channel.id === message.channel.id
//     );

//     return auditEntry;
//   }
// }

// // Этот класс только под лог активности войсов
// // По сути, я мог так не делать, но я посчитал, что так будет лучше. Декомпозировать функции мне совсем не охото


// /* 

// УХХХ ТУТ ДОЛЖНО БЫТЬ КУЧА МАТА :)

// ПОСМОТРИТЕ НА КОТИКОВ ТУТ -   https://www.youtube.com/watch?v=lerSwNkugrM&ab_channel=DomiShowPLAY

// */
