import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { LogsModule } from './logs/logs.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true
    }),

    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: "postgres",
        host: configService.getOrThrow("DB_HOST"),
        database: configService.getOrThrow("DB_NAME"),
        username: configService.getOrThrow("DB_USER"),
        password: configService.getOrThrow("DB_PASS"),
        port: Number(configService.getOrThrow("DB_PORT")),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        autoLoadEntities: true,
        synchronize: true,
        migrationsRun: true,
      }),
      inject: [ConfigService],
    }),

    AuthModule,

    LogsModule,

    UserModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}