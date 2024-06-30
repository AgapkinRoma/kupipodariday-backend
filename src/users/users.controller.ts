import { Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/decorators/user.decorator';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Get('/me')
  async getCurrentUser(@AuthUser() user: User) {
    const currentUser = await this.userService.findOne({
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
    return currentUser;
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
