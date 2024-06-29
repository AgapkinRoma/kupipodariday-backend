import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { WishList } from 'src/wishlists/wishlists.entity';
import { Offer } from 'src/offers/offers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, WishList, Offer])],
  providers: [WishesService],
  controllers: [WishesController],
})
export class WishesModule {}
