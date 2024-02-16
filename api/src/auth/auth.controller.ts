import {Body, Controller, Get, Post, Req, UseGuards} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { AuthService } from "./auth.service";
import {IsAuth} from "./guards/auth.guard";

@Controller('auth')
@ApiTags('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  /*
  @Get('discord/login')
  login() {
    return `https://discord.com/oauth2/authorize?client_id=1199749044956840088&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fdiscord%2Fcallback&scope=guilds+identify+email`
  }
  */

  @Get('discord/callback')
  callback(@Req() request: Request) {
    return this.authService.authorize(request)
  }

  @Post('discord/refresh')
  newAccessToken(@Body() refreshToken:string) {
    return this.authService.newAccess(refreshToken)
  }
}
