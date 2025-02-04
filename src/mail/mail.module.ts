import { MailgunModule } from "nestjs-mailgun";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MailController } from "./mail.controller";
import { MailService } from "./mail.service";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailgunModule.forRoot({
      username: "api",
      key: process.env.MAILGUN_API_KEY || "",
    }),
  ],
  controllers: [MailController], // ✅ Moved to controllers
  providers: [MailService], // ✅ Corrected provider
  exports: [MailService], // ✅ Exported correctly
})
export class MailModule {}
