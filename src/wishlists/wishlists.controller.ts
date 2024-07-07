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
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/users.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateWishDto } from 'src/wishes/dto/update-wish.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
@UseGuards(JwtAuthGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async createWishList(
    @Body() createWishlistDto: CreateWishlistDto,
    @AuthUser() user: User,
  ) {
    return this.wishlistsService.createWishlist(createWishlistDto, user.id);
  }
  @Get()
  async getAllWishlist() {
    return this.wishlistsService.findAllWishlist();
  }

  @Get(':id')
  async getWishlistById(@Param('id') id: number) {
    return this.wishlistsService.findWishlistById(id);
  }
  @Patch(':id')
  async updateWishlistData(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @AuthUser() user: User,
  ) {
    return this.wishlistsService.updateWishlistData(
      id,
      updateWishlistDto,
      user.id,
    );
  }
  @Delete(':id')
  async deleteWishlistById(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishlistsService.deleteWishlistById(id, user.id);
  }
}
