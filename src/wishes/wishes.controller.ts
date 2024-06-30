import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/decorators/user.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/users.entity';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wishes.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async createWish(@AuthUser() user: User, createWishDto: CreateWishDto) {
    console.log('Received wish data:', createWishDto);
    const newWish = await this.wishesService.createWish(user.id, createWishDto);
    return newWish;
  }
}
