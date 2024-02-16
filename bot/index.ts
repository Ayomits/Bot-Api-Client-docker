import { config } from "dotenv";
import { Client, Collection, GatewayIntentBits } from "discord.js";
import EventHandlerService from "./events/system/collectors/event.collector";
import {
  Button,
  SlashCommand,
  Event,
  UserID,
  InviteCode,
  CustomId,
  Intervals,
  GuildID,
  AuditCache,
  IPrefixCommand,
} from "./base.types";

config(); // это для dotenv

// расширение базово Client интерфейса чтобы делать коллекции

declare module "discord.js" {
  export interface Client {
    slashCommands?: Collection<string, SlashCommand>;
    prefixCommands?: Collection<string, IPrefixCommand>;
    buttons?: Collection<CustomId, Button>;
    events?: Collection<string, Event>;
    voiceUsers?: Collection<UserID, Intervals>;
    invites?: Collection<InviteCode, number | null>;
    auditCache?: Collection<GuildID, AuditCache>;
  }
} // Как я понял, то это переопределение типа для какого-то модуля под свои нужды
// для коллекций просто расширяем свойства, а могут быть и методы

// Подключение интентов

const intents = [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildVoiceStates,
]; // обычный массив интентов

const client: Client = new Client({ intents: intents }); // обычный client

// Создание коллекций под различные нужды

// стой там всё окей было, не переименовывай

client.prefixCommands = new Collection<string, IPrefixCommand>(); // храним команды
client.buttons = new Collection<CustomId, Button>(); // храним бесконечные кнопки
client.slashCommands = new Collection<string, SlashCommand>(); // храним команды
client.voiceUsers = new Collection<UserID, Intervals>(); // храним в кеше тех, кто в войсе
client.invites = new Collection<InviteCode, number>(); // храним инвай код и того кто его создал
client.auditCache = new Collection<GuildID, AuditCache>(); // кеш из журнала аудита, сохраняется для быстрой подгрузки (используется в logs ивентах)
// client.privateVoiceRooms = new Collection<string, Map<string, Discord.Invite>>()

// Вызов ивентхендлера

new EventHandlerService(client); // Ивент (за)луп(а)

client.login(process.env.TOKEN); // самая понятная пока что строчка
