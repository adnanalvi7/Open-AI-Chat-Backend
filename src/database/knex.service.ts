import { Injectable, OnModuleDestroy } from "@nestjs/common";
import knex, { Knex } from "knex";
import * as dotenv from "dotenv";

dotenv.config(); // Load environment variables

@Injectable()
export class KnexService implements OnModuleDestroy {
  private db: Knex;

  constructor() {
    this.db = knex({
      client: "pg",
      connection: {
        host: process.env.DB_HOST || "",
        user: process.env.DB_USER || "",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "",
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
