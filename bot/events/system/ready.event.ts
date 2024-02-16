import { Client, Events } from "discord.js";
import Event from "../../libs/structures/commands/event.structure";
import EventReadyService from "./services/ready.service";

export class Ready extends Event {
  name: string = Events.ClientReady;
  once: boolean = true;

  public async execute(client: Client) {
    const ready = new EventReadyService(client);
    await ready.commandActions(); // сбор и регистрация команд!
    await ready.connectToDb(); // подключаемся к базе данных
    // await ready.collectUser(); // собираем всех несозданных в моментт Downtime юзеров в коллекцию mongoose
    // await ready.usersInVoice(); // собираем всех юзеров в войсах в кэш
    // await ready.collectAllInvites(); // собираем все инвайты в кэш    
  }
}

/*
      Collection(1) [Map] {
        '1129162686194790572' => Timeout {
          _idleTimeout: 5000,
          _idlePrev: [TimersList],
          _idleNext: [TimersList],
          _idleStart: 4960,
          _onTimeout: [Function (anonymous)],
          _timerArgs: undefined,
          _repeat: 5000,
          _destroyed: false,
          [Symbol(refed)]: true,
          [Symbol(kHasPrimitive)]: false,
          [Symbol(asyncId)]: 178,
          [Symbol(triggerId)]: 0
        }
      }
    */ // вот так примерно выглядит коллекция с войс юзерами и не надо костылей с базой данных :)
    