import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  app.use(
    graphqlUploadExpress({
      maxFileSize: configService.get('ipfs').maxFileSize,
    }),
  );
  await app.listen(3000);
}
bootstrap();
