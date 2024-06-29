import { Controller, Get, Patch, Post } from '@nestjs/common';
import { AuthUser } from 'src/decorators/user.decorator';
import { User } from './users.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get('/me')
  async getCurrentUser(@AuthUser() user: User) {
    await this.userService.findOne({
      where: { id: user.id },
      select: {
        email: true,
        username: true,
        id: true,
        avatar: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Patch('/me')
  async updateCurrentUserData() {}

  @Get('/me/wishes')
  async getMyWishes() {}

  @Get(':username')
  async getUserByUsername() {}

  @Get(':username/wishes')
  async getWishes() {}

  @Post('/find')
  async findUser() {}
}
