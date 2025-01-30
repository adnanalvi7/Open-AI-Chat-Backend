import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { ConfigModule } from '@nestjs/config';
import { OpenAI } from 'openai'; // Import OpenAI SDK

@Module({
  imports: [ConfigModule], // Ensure ConfigModule is imported if using env variables
  providers: [
    {
      provide: 'OpenAI',
      useFactory: () => {
        return new OpenAI({ apiKey: process.env.OPEN_AI_SECRET_KEY });
      },
    },
    OpenAIService,
  ],
  exports: [OpenAIService],
})
export class OpenAIModule {}
