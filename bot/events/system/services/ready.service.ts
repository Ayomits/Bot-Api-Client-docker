// Сервис полностью отвечает за запуск бота и не больше
// Запуск ивентов, сбор кнопок и т.п.


import {
  ChannelType,
  Client,
  GuildChannel,
  REST,
  Routes,
} from "discord.js";
import InteractionCollector from "../collectors/interaction.collector";
import mongoose from "mongoose";
// import { User } from "../../../models/user";

export default class EventReadyService {
  constructor(
    private readonly client: Client,
    private readonly interactionCollector: InteractionCollector = new InteractionCollector(
      client
    )
  ) {}

  // Выполнение двух функций в одной
  public async commandActions() {
    await this.collectInteractions();
    await this.commandRegister(this.client);
  }

  // Функция связанная с базой данных
  // Перебор всех мемберов и гильдий
  // public async collectUser() {
  //   const start = Date.now();
  //   const guilds = this.client.guilds.cache.map((guild) => guild);
  //   for (const guild of guilds) {
  //     const members = await guild.members.fetch();

  //     members.forEach(async (member) => {
  //       const userExists = await User.findOne({
  //         guildID: guild.id,
  //         userID: member.id,
  //       });
  //       if (!userExists && !member.user.bot) {
  //         await User.create({ guildID: guild.id, userID: member.id });
  //       }
  //     });

  //     const end = (Date.now() - start) / 1000;

  //     console.log("[USERSHANDLER.JS] время выполнения " + end);
  //   }
  // }

  // Функция отвечает за сбор людей из каждого голосового канала на сервере и добавление их в коллекция, которая в будущем потребуется в 2 местах точно
  public async usersInVoice () {
    const guilds = this.client.guilds.cache;
    guilds.forEach((guild) => {
      guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).forEach(channel => {
        (channel as GuildChannel).members?.forEach(member => {
          return member.client.voiceUsers?.set(member.user.id, (setInterval as any)(() => {return;}, 5_000));
          // просто заглушка позже будет другая штука
        });
      });
    });
  } 

  public async collectAllInvites() {
    const guilds = this.client.guilds.cache;
    guilds.forEach(async guild => {
      const invites = await guild.invites.fetch();
      invites.forEach(invite => {
        invite.client.invites?.set(invite.code, invite.uses);
      });
    });
  }

  public async connectToDb() {
    mongoose
    .connect(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@mongo:27017/`, {
      autoCreate: true,
    })
    .then(() => {
      console.log("Успешное соединение с базой данных");
    })
    .catch((err) => {
      console.log(err);
    });
  }

  // Регистрация Слэш команд
  private async commandRegister(client: Client) {
    try {
      console.log(`[COMMANDREGISTER] начинаю регистрировать команды...`);

      const rest = new REST().setToken(
        process.env.TOKEN ||
          "MTEyNjk2ODYxMTkxNTk3Njg5NA.GMstbh.pT0jxxoacZaZmCwd3Mf-glqzT-sE_YsKFcPvF0" // старый токен если что, он не рабочий
      );
      const commands = client.slashCommands?.map((command) => command.data.toJSON());

      const commandsData: any = await rest.put(
        Routes.applicationCommands(client.user?.id || "1126968611915976894"),
        { body: commands }
      );

      console.log(
        `[COMMANDREGISTER] все команды зарегистрированы. Количество команд: ${commandsData.length}`
      );
    } catch (err) {
      console.log(err);
    }
  }

  // Сбор всех взаимодействий. Слэш команды, селекты, модалки, кнопки
  private async collectInteractions() {
    await this.interactionCollector.collect();
    console.log(
      "[INTERACTIONCOLLECTOR] все взаимодействия успешно собраны и добавлены в свои коллекции"
    );
  }
}
