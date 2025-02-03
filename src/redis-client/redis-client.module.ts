import { Module } from '@nestjs/common';
import { RedisClientService } from 'src/redis-client/redis-client.service';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // ConfigModule.forRoot(),
    // RedisModule.forRoot({
    //   type: 'single',
    //   url: 'redis://localhost:6379', // Connect to the local Redis server
    // }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'single',
        url: process.env.REDIS_URL, // Get Redis URL from .env
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisClientService],
  exports: [RedisClientService],
})
export class RedisClientModule {}
