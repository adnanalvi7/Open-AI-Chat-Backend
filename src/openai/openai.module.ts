import { Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { ConfigModule } from '@nestjs/config';
import { OpenAI } from 'openai';

@Module({
  imports: [ConfigModule.forRoot()],
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
