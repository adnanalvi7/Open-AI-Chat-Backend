import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { KnexService } from 'src/database/knex.service';


@Module({
  controllers: [UsersController],
  providers: [UsersService,KnexService],
  exports: [UsersService],
})
export class UsersModule {}