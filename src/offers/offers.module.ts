import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from 'src/wishes/wishes.entity';
import { User } from 'src/users/users.entity';
import { Offer } from './offers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wish, User, Offer])],
  providers: [OffersService],
  controllers: [OffersController],
})
export class OffersModule {}
