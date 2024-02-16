import { PartialType } from '@nestjs/swagger';
import {CreateChatLogDto, CreateLogDto, CreateVoiceLogDto} from './create-log.dto';
import {IsString} from "class-validator";

export class UpdateChatLogDto extends PartialType(CreateChatLogDto) {
    @IsString()
    guildId: string
}

export class UpdateVoiceLogDto extends PartialType(CreateVoiceLogDto) {

    @IsString()
    guildId: string
}