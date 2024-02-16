import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({origin: "*"})
  app.setGlobalPrefix('api')
  const swagger = new DocumentBuilder()
    .setTitle('Dashboard Api')
    .setDescription('Dashboard')
    .setVersion('1.1')
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(4000);

  console.log(`App listen on 4000 PORT`)
  console.log(process.env.DB_HOST)
}
bootstrap();
