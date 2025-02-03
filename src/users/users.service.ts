import { ConflictException, Injectable } from '@nestjs/common';
import { KnexService } from 'src/database/knex.service';
import { CreateUserDto } from './users.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly knexService: KnexService) {}

  async findAll(): Promise<CreateUserDto[]> {
    return this.knexService.getDb().select('*').from('users');
  }

  async createUser(user: CreateUserDto): Promise<number[]> {
    const existingUser = await this.knexService
      .getDb()
      .table('users')
      .where({ email: user.email })
      .first();

    if (existingUser) {
      throw new ConflictException('Email already exists.');
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return this.knexService.getDb().table('users').insert(user).returning('id');
  }

  async deleteUser(id: number): Promise<number> {
    return await this.knexService.getDb().table('users').where({ id }).del();
  }
}
