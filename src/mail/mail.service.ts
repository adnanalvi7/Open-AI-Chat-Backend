import { Injectable } from "@nestjs/common";
import { MailgunService } from "nestjs-mailgun";

@Injectable()
export class MailService {
  constructor(private readonly mailgunService: MailgunService) {}

  async sendEmail(to: string, subject: string, text: string, html?: string) {
    try {
      const response = await this.mailgunService.createEmail(
        process.env.MAILGUN_DOMAIN || "",
        {
          from: process.env.FROM_MAILGUN_EMAIL || "",
          to,
          subject,
          text,
          html,
        }
      );

      return response;
    } catch (error: unknown) {
      console.error("Mailgun error:", error);
      throw error;
    }
  }
}
