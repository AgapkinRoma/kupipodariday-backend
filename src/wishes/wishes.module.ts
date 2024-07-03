import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { WishList } from 'src/wishlists/wishlists.entity';
import { Offer } from 'src/offers/offers.entity';
import { Wish } from './wishes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, WishList, Offer, Wish])],
  providers: [WishesService],
  controllers: [WishesController],
  exports: [WishesModule, WishesService],
})
export class WishesModule {}
