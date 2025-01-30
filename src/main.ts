import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

async function bootstrap() {
  const app = await NestFactory.create(AppModule,  { cors: true });
  const port = process.env.PORT || 3000;

  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000', // Specify the front-end URL
    credentials: true, // Enable reading cookies from the request
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    maxAge: 24 * 60 * 60 * 5, // Set the maximum age of preflight requests to 5 days
  };


  // Enable CORS with the specified options.
  app.enableCors(corsOptions);



  await app.listen(port, () =>
    console.log(`📢 Server starting on: http://localhost:${port}/ ⚡️`),
  );
}
bootstrap();
