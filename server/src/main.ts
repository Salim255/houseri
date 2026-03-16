import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { HttpExceptionsErrorHandler } from './common/errors-handler/http-exception-errors-handler';
import { processErrorHandler } from './common/errors-handler/process-errors-handler';
import { Logger } from '@nestjs/common';
import { corsConfig } from './config/cors.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  // A built-in NestJS class that creates the application instance
  // Initializes all modules and services.
  // Sets up internal NestJS core (routing, dependency injection, etc.).
  // Prepares the Express (or Fastify) HTTP server.
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Initialize Cors config
  corsConfig(app);

  // Cookie parser
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cookieParser());

  //
  // Raw parser for Stripe webhook route
  app.use(
    '/api/v1/payments/webhook',
    bodyParser.raw({ type: 'application/json' }),
  );

  // Initialize Swagger
  setupSwagger(app);

  // Errors handlers
  // Register http exception errors handler
  app.useGlobalFilters(new HttpExceptionsErrorHandler());
  //  Register process errors handler
  processErrorHandler(app);

  // Use the Morgan middleware for logging
  app.use(morgan('dev'));
  // Morgan is a middleware for logging HTTP requests in Node.js application

  // Port number
  const PORT = process.env.PORT ?? 3000;

  // App listener
  await app.listen(PORT, () => {
    const logger = new Logger('MAIN');
    logger.log('Http Server running... ✅ on port number: ', PORT);
  });
}

// This is the main function that starts the application
bootstrap().catch((err) => {
  console.error('❌ Error during application bootstrap:', err);
  process.exit(1);
});
