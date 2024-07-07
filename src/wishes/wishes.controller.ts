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
import { User } from 'src/users/users.entity';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateWishDto } from './dto/update-wish.dto';
@UseGuards(JwtAuthGuard)
@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @Post()
  async createWish(
    @AuthUser() user: User,
    @Body() createWishDto: CreateWishDto,
  ) {
    return this.wishesService.createWish(user.id, createWishDto);
  }

  @Get('/top')
  async getTopWishes() {
    return this.wishesService.getTopWishes();
  }

  @Get('/last')
  async getLastWishes() {
    return this.wishesService.getLastWishes();
  }

  @Get()
  async findAllWishes() {
    return this.wishesService.findAllWishes();
  }
  @Get(':id')
  async findWishById(@Param('id') id: number) {
    return this.wishesService.getWishById(id);
  }

  @Patch(':id')
  async updateWishDate(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @AuthUser() user: User,
  ) {
    return this.wishesService.updateWishData(id, updateWishDto, user.id);
  }
  @Delete(':id')
  async deleteWish(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishesService.deleteWish(id, user.id);
  }

  @Post(':id/copy')
  async copyWish(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishesService.copyWish(id, user.id);
  }
}
