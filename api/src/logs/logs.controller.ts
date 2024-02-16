import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LogsService } from './logs.service';
import { CreateLogDto } from './dto/create-log.dto';
import {UpdateChatLogDto, UpdateVoiceLogDto} from './dto/update-log.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsAuth } from 'src/auth/guards/auth.guard';

@Controller('logs')
@ApiTags('logs')
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get("allsettings/:guildId")
  allSettings(@Param() guildId: string) {
    return this.logsService.findAllSettings(guildId)
  }

  @Get('chatsettings/:guildId')
  chatSettings(@Param() guildId: string) {
    return this.logsService.findChatSettings(guildId)
  }

  @Get("voicesettings/:guildId")
  voiceSettings(@Param() guildId: string) {
    return this.logsService.findVoiceSettings(guildId)
  }

  @Post("createsettings")
  @UseGuards(IsAuth)
  @ApiBearerAuth('jwt')
  createChatSettings (@Body() dto: CreateLogDto) {
    return this.logsService.createSettings(dto)
  }

  @Patch("updatechatsettings")
  @UseGuards(IsAuth)
  @ApiBearerAuth('jwt')
  updateChatSettings(@Body() dto: UpdateChatLogDto) {
    return this.logsService.updateChatSettings(dto)
  }

  @Patch('updatevoicesettings')
  @UseGuards(IsAuth)
  @ApiBearerAuth('jwt')
  updateVoiceSettings (@Body() dto: UpdateVoiceLogDto) {
    return this.logsService.updateVoiceSettings(dto)
  }
  
}
