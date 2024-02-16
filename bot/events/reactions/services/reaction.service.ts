import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, Message, User, ButtonStyle, Embed, ButtonInteraction, } from "discord.js";
import axios from "axios";
import * as path from 'path'
import * as fs from 'fs'


export class ReactionsService {

  // Main функция, которая вызывается внутри контроллера (messageCreate.event.ts)
  // Посколько ты это читаешь, желаю налить крепкого кофе и как можно больше нервов)
  // А, и да) 
  // Это не я придумал так файлы и папки расставлять, мне эту штуку посоветовал тимлид Boticord'a)

  public async main(message: Message): Promise<any> {
    
    // Бла-бла константы ради констатн
    // Ща поясню
    
    // получаем первый параметр команды, т.е. возможный ключ
    const reaction = message.content.toLowerCase().replace(process.env.PREFIX || ".", "").split(' ')[0] 
    // считываю конфиг реакций
    const config = await this.readConfig('reactions.json') 
    // получаю верхний ключ самой реакции
    const reactionKey = await this.getReactionKey(reaction, config) 
    // проверяю на то не undefined ли этот ключик : )
    if (!reactionKey) { // анлак, не повезло мне, ну собсна получай ничего))
      return // Просто вывожу из функции => заканчиваю этот ивент
    }

    const reactionStruct = await this.getReactionStruct(reactionKey, config)
    
    const reactionUrl = await this.getReactionUrl(reactionKey, config)

    const targetUser = message.mentions.users.first()
    const authorId = message.author.id
    
    const embed = new EmbedBuilder()
                  .setTitle(`Реакция: ${reactionStruct?.action?.toLowerCase()}`)
                  .setColor(process.env.BASE_EMBED_COLOR ? parseInt(process.env.BASE_EMBED_COLOR, 16) : null)
                  .setFooter({iconURL: message.author ? message.author?.displayAvatarURL() : undefined, text: message.author?.username})

    let description: string = ""
    
    if (!reactionStruct?.everyone) { // по правде говоря я хз как всё сделать адекватно, поэтому тут будет нарушен DRY. Обидно
      
      if (targetUser) {
        const isAuthor = await this.isAuthor(targetUser.id, message.author.id)
        const isBot = await this.isBot(targetUser)
        isBot ? description += "Я тоже считаю, что боты живые, но укажи корректного пользователя!" 
                : isAuthor ? description += "Тебе так одиноко? Укажи другого пользователя, а не себя!" : false // Немного нарушаю принцип KISS : ((( (ну или же Keep It Simple, Stupid!)
  
        if (!isAuthor && !isBot) { // если не бот или автор
          if (reactionStruct?.isAcceptable) { // если реакцию нужно принимать
            return await this.acceptableReactionDescription(message, targetUser.id, authorId, reactionStruct, embed, reactionUrl)
          }else { // если реакцию не нужно принимать и она с пингом
            description += await this.generatePingDescription(targetUser.id, authorId, reactionStruct)
            return await message.reply({embeds: [embed.setDescription(description).setImage(reactionUrl)]})
          }
        } else { // если бот или автор
          return await message.reply({embeds: [embed.setDescription(description)]})
        }
      } else { // если нет пингуемого юзера
        return await message.reply({embeds: [embed.setDescription("Укажите пользователя!")]})
      }
    } else {
      if (targetUser) {

        const isAuthor = await this.isAuthor(targetUser.id, message.author.id)
        const isBot = await this.isBot(targetUser)
        isBot ? description += "Я тоже считаю, что боты живые, но укажи корректного пользователя!" 
                : isAuthor ? description += "Тебе так одиноко? Укажи другого пользователя, а не себя!" : false // Немного нарушаю принцип KISS : ((( (ну или же Keep It Simple, Stupid!)
        
        
        if (!isAuthor && !isBot) {
          description += await this.generatePingDescription(targetUser.id, authorId, reactionStruct)
          return await message.reply({embeds: [embed.setDescription(description).setImage(reactionUrl)]})
        } else {
          return await message.reply({embeds: [embed.setDescription(description)]})
        }
      } else {
        
        description += await this.generateNotPingDescription(authorId, reactionStruct)
        return await message.reply({embeds: [embed.setDescription(description).setImage(reactionUrl)]})
      }
    } 
  }

  // Читаем содержимое конфига, функция использована 2 раза! 

  private async readConfig(configName: string): Promise<any> {
    const configPath = path.resolve(__dirname, '..', 'configs', configName)
    const config = JSON.parse(await fs.promises.readFile(configPath, 'utf-8'))
    return config
  }

  // Получение верхнего ключа реакции
  private async getReactionKey(reaction: string, config: ConfigData): Promise<string> {
    const reactionConf = config[reaction] // Только ради проверки тут стоит. Могу ли я получить конфиг : ) Если да, то считай, что эта [Данные удалены] лотерея выиграна
    if (!reactionConf) { // Ну а если нет, то пробегаемся по ключам и ищем аляс : ) Дооооолгая операция, но другого способа не знаю
      for (let key in config) {
        const entry = config[key]
        if (entry.aliases.includes(reaction)) {
          return key
        }
      }
    }
    return reaction
  }
  
  // Получаем конфиг реакции. Т.е. её поля : )
  private async getReactionStruct(reactionKey:string, config: ConfigData): Promise<ConfigStruct> {
    return config[reactionKey]
  }

  // Поскольку у нас есть 2 типа получения ссылки изображения, то это нужно как-то проверять
  // Параметр конфиг и reactionKey нужны для проверки типа ссылки у реакции
  private async getReactionUrl(reactionKey: string, config: ConfigData): Promise<any> {
    if (config[reactionKey]?.isApi) {
      const request = await axios.get(process.env.API_URL + `/gif?reaction=${reactionKey}&format=gif`);
      return request.data?.url;
    } else {
      const reactionUrls: ReactionsUrl = await this.readConfig("reactionslink.json");
      const urls = reactionUrls[reactionKey];
      if (urls && urls.length > 0) {
        const randIndex = Math.floor(Math.random() * urls.length);
        return urls[randIndex];
      }
    }
  }

  // Ты бот?! Да? Точно? Верю!
  private async isBot(targetUser: User): Promise<boolean> {
    return targetUser.bot
  }

  // Ты это сам ты? Да? Точно? Не верю!
  private async isAuthor(targetUserId: string, authorId: string): Promise<boolean> {
    return targetUserId === authorId
  }

  // Да-да, я понимаю, что это не лучшая практика, ну а чо мне, я по-другому не придумав
  private async generatePingDescription(targetUserId: string, authorId: string, struct: ConfigStruct): Promise<string>{
    return `<@${authorId}> ${struct.verbal} ${struct.memberVerb} <@${targetUserId}>`
  }

  // Да-да, я понимаю, что это не лучшая практика, ну а чо мне, я по-другому не придумав
  private async generateNotPingDescription(authorId: string, struct: ConfigStruct): Promise<string>{
    return `<@${authorId}> ${struct.verbal} ${struct.everyoneVerb}`
  }

  // По факту я тут генерю дескрипшон, через функцию generatePingDescription, но добавляю приправу в виде коллектора с кнопочками
  private async acceptableReactionDescription(
    message: Message, 
    targetUserId: string, 
    authorId: string, struct: 
    ConfigStruct, embed: EmbedBuilder, 
    reactionlink: string): Promise<any>
    {
    const requestButtons: any = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
          .setCustomId(`accept_${targetUserId}`)
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("✅"),
      new ButtonBuilder()
          .setCustomId(`cancel_${targetUserId}`)
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("❌")
    ) // как же я ненавижу эту штуку в TypeScript, я вообще хз какой тут тип

    let isClicked: boolean = false // флажок для коллектора
    await message.reply({embeds: [embed.setDescription(`<@${targetUserId}> эй! Тебя тут <@${authorId}> хочет ${struct.action.toLowerCase()}. Что скажешь? И нет-нет, я не завидую`)], components: [requestButtons]})

    message.createMessageComponentCollector({
      time: 15_000,
      filter: interaction => interaction.user.id === targetUserId
    }).on('collect', async (interaction: ButtonInteraction): Promise<any> => {
      switch (interaction.customId) {
        case `accept_${targetUserId}`:
          isClicked = true
          return await interaction.message.edit({embeds:[embed.setDescription(await this.generatePingDescription(targetUserId, authorId, struct)).setImage(reactionlink)], components: []})
        case `cancel_${targetUserId}`:
          isClicked = true
          return await interaction.message.edit({embeds: [embed.setDescription(`<@${targetUserId}> отклонил ваше предложение :(`)], components: []})
      }
    }).on('end', async (interaction: ButtonInteraction): Promise<any> => {
      try {
        console.log('here');
        return !isClicked ? await interaction.message.edit({embeds:[embed.setDescription("Время реакции истекло")]}) : null
      } catch (err) {
        console.log(err);
      }
      
    })
  }
}

// То что внутри конфига реакций (reactions.json)
type ConfigStruct = {
  "action": string,
  "api_name": string,
  "everyone": boolean,
  "everyoneVerb": string,
  "isApi": boolean,
  "memberVerb": string,
  "verbal": string,
  "type": string,
  "isAcceptable": boolean,
  "nsfw": boolean,
  "aliases": string[], // string[] это массив строк
  "cost": number
}

// То как выглядит сам конфиг
type ConfigData = {[key: string]: ConfigStruct}

// string[] это массив строк
type ReactionsUrl = {[key: string]: string[]}