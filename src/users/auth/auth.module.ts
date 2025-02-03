import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users.module'; // Import UsersModule
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { KnexService } from 'src/database/knex.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisClientService } from 'src/redis-client/redis-client.service';
// import { UsersModule } from '../users.module'; // Import UsersModule

@Module({
  imports: [
    UsersModule,
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
  controllers: [AuthController],
  providers: [AuthService, KnexService,RedisClientService],
  exports: [AuthService],
})
export class AuthModule {}
