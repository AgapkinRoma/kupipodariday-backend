import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from 'src/wishes/wishes.entity';
import { WishList } from 'src/wishlists/wishlists.entity';
import { Offer } from 'src/offers/offers.entity';
import { User } from './users.entity';
import { WishesModule } from 'src/wishes/wishes.module';
import { WishesService } from 'src/wishes/wishes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wish, WishList, Offer, User]),
    WishesModule,
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, UsersModule],
})
export class UsersModule {}
