import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/User.entity';
import { Oauth2CredentialsEntity } from './entities/Oauth2Credentials.entity';
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, Oauth2CredentialsEntity]),
    JwtModule.register({
      secret: process.env.SECRET_KEY_JWT || "SECRET_KEY",
      signOptions: {
        expiresIn: "48h"
      }
    })
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthModule, TypeOrmModule, JwtModule]
})
export class AuthModule {}
