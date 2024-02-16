import { Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { AuthModule } from 'src/auth/auth.module';
import { IsAuth } from 'src/auth/guards/auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogSettingsEntity } from './entities/log.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([LogSettingsEntity])
  ],
  controllers: [LogsController],
  providers: [LogsService, IsAuth],
  exports: [LogsModule, TypeOrmModule]
})
export class LogsModule {}
