import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers(): Promise<CreateUserDto[]> {
    return this.usersService.findAll();
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createUser(@Body() body: CreateUserDto) {
    const [id] = await this.usersService.createUser(body);
    if (!id) return { message: 'User cannot create!', success: false };
    else return { message: 'User created successfully!', success: true };
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: number) {
    const deletedRows = await this.usersService.deleteUser(id);
    if (deletedRows === 0)
      return { message: 'User not found!', success: false };
    else return { message: 'User deleted successfully!', success: true };
  }
}
