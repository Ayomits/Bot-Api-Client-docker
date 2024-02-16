import { BadRequestException, Injectable } from "@nestjs/common";
import { Request } from "express";
import * as process from "process";
import axios from "axios";
import { DataHeadersType, GuildType, TokensType } from "./utils/types";
import { Repository } from "typeorm";
import { Oauth2CredentialsEntity } from "./entities/Oauth2Credentials.entity";
import { UserEntity } from "./entities/User.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Oauth2CredentialsEntity) private oauth2Repository: Repository<Oauth2CredentialsEntity>,
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}

  async authorize(request: Request) { // главная функция, что вернёт JWT токен для авторизации
    const code = await this.getCode(request) as string // получает код из ссылки
    const token = await this.getToken(code) as TokensType // получает access и refresh токены от аккаунта дискорда

    const headers = {
      "Authorization": `Bearer ${token.accessToken}`,
      "Content-Type": "application/json"
    } as DataHeadersType // чтобы лишний раз не повторять хедеры в вызовах функций getUserData и getGuildData

    const userData = (await this.getUserData(headers)).data // получаю JSON о юзере
    const guildsData = await (await this.getGuildData(headers)).data // Получаю JSON о всех серверах пользователя

    const user = await this.createUser(userData, guildsData) as UserEntity // создаю пользователя

    const jwt = await this.createJwt(user) // генерирую jwt токены

    await this.saveTokens(token, user.userId) // сохраняю токены в базу данных
    
    return {
      'accessToken': jwt  
    } // возвращаю jwt токен для входа в систему
  } // Authorize User

  async newAccess(refreshToken: string) { // не смотри, это неважно
    const data = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      redirect_uri: process.env.REDIRECT_URI,
      scope: JSON.parse(process.env.SCOPES),
    };

    try {
      const response = await axios.post("https://discord.com/api/oauth2/token", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return response.data?.access_token

    } catch (error) {}
  } // exchange refresh to access

  private async getCode(request: Request){ // получение кода из параметра
    return request.query?.code
  } // code from query param

  private async getToken(code: string): Promise<TokensType> {
    const data = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.REDIRECT_URI,
      scope: ['guilds', 'identify', 'email'],
    }

    try {
      const req = await axios.post('https://discord.com/api/oauth2/token', data, { headers: { "Content-Type": "application/x-www-form-urlencoded" } })

      return {
        accessToken: req.data?.access_token,
        refreshToken: req.data?.refresh_token
      }
    } catch (err) {
      throw new BadRequestException(err)
    }
  } // Access and refresh discord tokens

  private async saveTokens (tokens: TokensType, userId: string) {
    const existedRow = await this.oauth2Repository.findOne({where: {userId: userId}})
    if (existedRow) {
      existedRow.accessToken, existedRow.refreshToken = tokens.accessToken, tokens.refreshToken
      await this.oauth2Repository.update(existedRow.userId, existedRow)

      return existedRow
    }

    const newTokens = await this.oauth2Repository.create({userId: userId, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken})

    return await this.oauth2Repository.save(newTokens)
  }

  private async createUser(userData: any, guildsData: GuildType[]) {
    const existedUser = await this.userRepository.findOne({ where: { userId: userData.id } });
    
    const guilds = await this.sortGuilds(guildsData)

    if (existedUser) {
      existedUser.guildsData = guilds
      await this.userRepository.update(existedUser.userId, existedUser)
      return existedUser;
    }
    
    const query = this.userRepository.create({
      userId: userData.id,
      email: userData.email,
      avatar: userData.avatar,
      isAdmin: false,
      guildsData: guilds, 
    });
  
    return await this.userRepository.save(query);
  } // create or update user

  private async sortGuilds(guildsData: GuildType[]): Promise<GuildType[]> {
    const guilds = []; 
    guildsData.forEach((guild: GuildType) => {
      if (guild.owner || guild.permissions & 8) {
        guilds.push({
          id: guild.id,
          owner: guild.owner,
          permissions: guild.permissions,
          icon: guild.icon,
          name: guild.name,
        });
      }
    });

    return guilds
  } // sort guilds when user owner or admin

  private async createJwt(user: UserEntity) {
    const payload = {
      userId: user.userId,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
    }

    return await this.jwtService.sign(payload)
  } // create JWT by User entity

  private async getUserData(headers: DataHeadersType) {
    return await axios.get("https://discord.com/api/users/@me", { headers: headers })
  } // Email, username, avatar, etc.

  private async getGuildData(headers: DataHeadersType) {
    return await axios.get("https://discord.com/api/users/@me/guilds", { headers: headers, params: {fields: ['id', 'owner', 'permissions', 'icon', 'name']} }); // all user Servers
  }
}
