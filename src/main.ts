import { join } from 'path';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as Sentry from '@sentry/node';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import { setupApiDocs } from 'common/config/api-docs';
import { RATE_LIMIT_REQUESTS, RATE_LIMIT_TIME } from 'common/config/rate-limit';
import { templateEngineConfig } from 'common/config/template-engine';
import { AllExceptionsFilter } from 'common/filters';
import { loggerMiddleware } from 'common/middlewares';
import { CustomValidationPipe } from 'common/pipes';
import { AppModule } from 'modules/app/app.module';

const isProdEnv = process.env.NODE_ENV === 'production';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger(bootstrap.name);
  const configService = app.get('configService');

  app.enable('trust proxy'); // used for rate limiter
  app.enableShutdownHooks();
  app.get(AppModule).subscribeToShutdown(() => app.close());

  app.engine('hbs', templateEngineConfig);
  app.setViewEngine('hbs');

  app.use(compression());
  app.use(cookieParser());
  app.use(helmet());
  app.use(loggerMiddleware);
  app.use(
    rateLimit({
      windowMs: RATE_LIMIT_TIME,
      max: RATE_LIMIT_REQUESTS,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(
    new CustomValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );
  app.useStaticAssets(join(process.cwd(), 'public'));
  setupApiDocs(app);
  if (isProdEnv) {
    Sentry.init({ dsn: configService.get('SENTRY_DSN') });
  }

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
