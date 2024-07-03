import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthUser } from 'src/decorators/user.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/users.entity';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateWishDto } from './dto/update-wish.dto';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async createWish(
    @AuthUser() user: User,
    @Body() createWishDto: CreateWishDto,
  ) {
    const newWish = await this.wishesService.createWish(user.id, createWishDto);
    return newWish;
  }
  @Get(':id')
  async findWishById(@Param('id') id: number) {
    return this.wishesService.getWishById(id);
  }
  @Get()
  async findAllWishes() {
    return this.wishesService.findAllWishes();
  }
  @Patch(':id')
  async updateWishDate(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateWishData(id, updateWishDto);
  }
  @Delete(':id')
  async deleteWish(@Param('id') id: number) {
    return this.wishesService.deleteWish(id);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copyWish(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishesService.copyWish(id, user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/top')
  async getTopWishes() {
    return this.wishesService.getTopWishes();
  }
  @UseGuards(JwtAuthGuard)
  @Get('/last')
  async getLastWishes() {
    return this.wishesService.getLastWishes();
  }
}
