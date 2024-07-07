import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from 'src/wishes/wishes.entity';
import { User } from 'src/users/users.entity';
import { WishList } from './wishlists.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wish, User, WishList])],
  providers: [WishlistsService],
  controllers: [WishlistsController],
})
export class WishlistsModule {}
