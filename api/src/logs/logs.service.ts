import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateChatLogDto, UpdateVoiceLogDto } from './dto/update-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LogSettingsEntity } from './entities/log.entity';
import { Repository } from 'typeorm';
import { SettingsResponseType } from './utils/types';

@Injectable()
export class LogsService {
  constructor(
      @InjectRepository(LogSettingsEntity)
      private logSettingsRepository: Repository<LogSettingsEntity>
  ) {}

  async findAllSettings(guildId: string): Promise<SettingsResponseType> {
    const settings = await this.logSettingsRepository.findOne({ where: { guildId } });
    return { settings };
  }

  async findChatSettings(guildId: string) {
    const allSettings = await this.findAllSettings(guildId);
    return { chat: allSettings?.settings.chat };
  }

  async findVoiceSettings(guildId: string) {
    const allSettings = await this.findAllSettings(guildId);
    return { voice: allSettings?.settings.voice };
  }

  async findModSettings(guildId: string) {
    const allSettings = await this.findAllSettings(guildId);
    return { mod: allSettings?.settings.mod };
  }

  async createSettings(dto: CreateLogDto) {
    const existedSettings = await this.findAllSettings(dto.guildId);
    if (existedSettings) {
      throw new BadRequestException(`Settings for this guild already exist. Please update instead.`);
    }

    const settings = this.logSettingsRepository.create(dto);
    return this.logSettingsRepository.save(settings);
  }

  async updateChatSettings(dto: UpdateChatLogDto) {
    const existedSettings = await this.findAllSettings(dto.guildId);
    const existedSettingsEntity = existedSettings.settings;

    if (!existedSettingsEntity) {
      throw new BadRequestException("Settings for this guild don't exist.");
    }

    existedSettingsEntity.chat = dto;
    await this.logSettingsRepository.save(existedSettingsEntity);
    return { settings: existedSettingsEntity.chat };
  }

  async updateVoiceSettings(dto: UpdateVoiceLogDto) {
    const existedSettings = await this.findAllSettings(dto.guildId);
    const existedSettingsEntity = existedSettings.settings;

    if (!existedSettingsEntity) {
      throw new BadRequestException("Settings for this guild don't exist.");
    }

    existedSettingsEntity.voice = dto;
    await this.logSettingsRepository.save(existedSettingsEntity);
    return { settings: existedSettingsEntity.voice };
  }
}