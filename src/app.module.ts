import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OpenAIModule } from "./openai/openai.module";
import { ChatGateway } from "./chat/chat.gateway";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./users/auth/auth.module";
import { RedisClientModule } from "./redis-client/redis-client.module";
import { JwtModule } from "@nestjs/jwt";
import { MailModule } from "./mail/mail.module";
@Module({
  imports: [
    OpenAIModule,
    ConfigModule,
    AuthModule,
    MailModule,
    RedisClientModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRE,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
