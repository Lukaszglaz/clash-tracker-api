import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(process.cwd(), '.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  if (!process.env.DATABASE_URL) {
    logger.error('DATABASE_URL is missing! Check your .env file.');
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  logger.log(`Application is running on: http://localhost:3000`);
}
bootstrap();
