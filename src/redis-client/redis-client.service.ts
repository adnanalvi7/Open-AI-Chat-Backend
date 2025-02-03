import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class RedisClientService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setKey(key: string, value: string,time?:number): Promise<void> {
    if(time) await this.redis.set(key, value, 'EX', time);
    else await this.redis.set(key, value);
  }

  async getKey(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async deleteKeys(keys: string[]): Promise<number> {
    return await this.redis.del(...keys);
  }

  async getCount(ipAddress: string): Promise<number> {
    const count = await this.redis.get(`ip:${ipAddress}:count`);
    return count ? parseInt(count, 10) : 0;
  }

  // Increment the message count for an IP address
  async incrementCount(ipAddress: string): Promise<void> {
    await this.redis.incr(`ip:${ipAddress}:count`);
  }

  // Reset the message count for an IP address (optional)
  async resetCount(ipAddress: string): Promise<void> {
    await this.redis.del(`ip:${ipAddress}:count`);
  }
}
