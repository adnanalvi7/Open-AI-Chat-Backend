import { Injectable, OnModuleDestroy } from '@nestjs/common';
import knex, { Knex } from 'knex';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

@Injectable()
export class KnexService implements OnModuleDestroy {
  private db: Knex;

  constructor() {
    this.db = knex({
      client: 'pg',
      connection: {
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '1234',
        database: process.env.DB_NAME || 'openai',
      },
    });
  }

  getDb() {
    return this.db;
  }

  async onModuleDestroy() {
    await this.db.destroy();
  }
}
