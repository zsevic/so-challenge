import { join } from 'path';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { AppModule } from 'modules/app/app.module';
import { setupApiDocs } from 'common/config/api-docs';
import { setupTemplateEngine } from 'common/config/template-engine';
import { AllExceptionsFilter } from 'common/filters';
import { loggerMiddleware } from 'common/middlewares';
import { CustomValidationPipe } from 'common/pipes';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger(bootstrap.name);
  const configService = app.get('configService');

  app.enableCors({
    credentials: true,
    origin: configService.get('CLIENT_URL'),
  });
  app.setBaseViewsDir(join(__dirname, '../..', 'views'));
  setupTemplateEngine(__dirname);
  app.setViewEngine('hbs');
  app.use(compression());
  app.use(cookieParser());
  app.use(loggerMiddleware);
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new CustomValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );
  app.useStaticAssets(join(__dirname, '../..', 'public'));
  setupApiDocs(app);

  await app.listen(configService.get('PORT')).then(() => {
    logger.log(`Server is running on port ${configService.get('PORT')}`);
  });
}

bootstrap();

process.on('unhandledRejection', function handleUnhandledRejection(
  err: Error,
): void {
  const logger = new Logger(handleUnhandledRejection.name);
  logger.error(err.stack);
});
