import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { OpenAIService } from './openai/openai.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly openAIService: OpenAIService) {}

  @Get()
  getHello(): Promise<string> {
    return this.openAIService.generateText(this.appService.getHello());
  }
}
