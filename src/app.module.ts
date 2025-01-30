import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAIModule } from './openai/openai.module';

@Module({
  imports: [OpenAIModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
