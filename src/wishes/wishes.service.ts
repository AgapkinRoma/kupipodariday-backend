import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './wishes.entity';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wishes.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishesRepository: Repository<Wish>,
  ) {}
  async createWish(
    userId: number,
    createWishDto: CreateWishDto,
  ): Promise<Wish> {
    const newWish = await this.wishesRepository.create({
      ...createWishDto,
      owner: { id: userId },
    });
    return this.wishesRepository.save(newWish);
  }
}
