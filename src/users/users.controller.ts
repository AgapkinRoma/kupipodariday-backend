import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthUser } from 'src/decorators/user.decorator';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { FindUserDto } from './dto/find-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private wishesService: WishesService,
  ) {}
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
  @Get()
  async findAllUsers() {
    return this.userService.findAllUsers();
  }
  @Patch('/me')
  async updateCurrentUserData(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUserData = await this.userService.updateOne(
      user.id,
      updateUserDto,
    );
    return updatedUserData;
  }

  @Get('/me/wishes')
  async getMyWishes(@AuthUser() user: User) {
    return this.wishesService.findOwnerWishes(user.id);
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    return this.userService.findUserByUsername(username);
  }

  @Get(':username/wishes')
  async getWishes(@Param('username') username: string) {
    const user = await this.userService.findUserByUsername(username);
    return this.wishesService.findOwnerWishes(user.id);
  }

  @Post('/find')
  async findMany(@Query('query') query: string) {
    return this.userService.findUser(query);
  }
}
