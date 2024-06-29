import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from 'src/wishes/wishes.entity';
import { WishList } from 'src/wishlists/wishlists.entity';
import { Offer } from 'src/offers/offers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wish, WishList, Offer])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, UsersModule],
})
export class UsersModule {}
