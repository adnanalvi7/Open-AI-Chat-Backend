import { Injectable, Inject } from "@nestjs/common";
import { OpenAI } from "openai";

@Injectable()
export class OpenAIService {
  constructor(@Inject("OpenAI") private readonly openai: OpenAI) {}

  /**
   * Make a request to ChatGPT to generate a response based on a prompt and message history.
   * @param prompt - The prompt for the ChatGPT model
   * @param messages - An array of messages representing the conversation history
   * @returns A string containing the generated response
   */

  async generateText(prompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    });

    return response.choices[0].message.content || "";
  }
}
