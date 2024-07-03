import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './wishes.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

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
  async findOwnerWishes(ownerId: number) {
    const ownerWishes = await this.wishesRepository.find({
      where: { owner: { id: ownerId } },
    });
    if (!ownerWishes) {
      throw new NotFoundException(`У данного пользователя отсутствуют подарки`);
    }
    return ownerWishes;
  }

  async getWishById(id: number) {
    const wish = await this.wishesRepository.findOne({ where: { id } });
    if (!wish) {
      throw new NotFoundException(`Подарок по указанному id ${id} не найден`);
    } else {
      return wish;
    }
  }

  async updateWishData(id: number, updateWishDto: UpdateWishDto) {
    const wish = await this.wishesRepository.update(id, updateWishDto);
    if (!wish) {
      throw new NotFoundException(`Подарок по указанному id ${id} не найден`);
    }
    const updatetWish = await this.wishesRepository.findOne({ where: { id } });
    return updatetWish;
  }

  async deleteWish(id: number) {
    const deletedWish = await this.wishesRepository.delete(id);
    if (!deletedWish) {
      throw new NotFoundException(`Подарок по указанному id ${id} не найден`);
    }
    return { message: `Подарок с ${id} успешно удален` };
  }

  async findAllWishes() {
    return this.wishesRepository.find({});
  }

  async copyWish(id: number, userId: number) {
    const wishToCopy = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    console.log('ownerid', wishToCopy.owner.id);
    if (!wishToCopy) {
      throw new NotFoundException(`Подарок по указанному id ${id} не найден`);
    }

    if (wishToCopy.owner.id === userId) {
      throw new UnauthorizedException(
        'Вы не можете копировать свой собственный подарок.',
      );
    }
    wishToCopy.copied += 1;
    await this.wishesRepository.save(wishToCopy);
    const copiedWish = await this.wishesRepository.create({
      ...wishToCopy,
      id: undefined,
      owner: { id: userId },
      copied: 0,
    });
    return this.wishesRepository.save(copiedWish);
  }

  async getLastWishes() {
    const lastWishes = await this.wishesRepository.find({
      take: 40,
      order: {
        createdAt: 'DESC',
      },
      relations: ['owner'],
    });
    return lastWishes;
  }
  async getTopWishes() {
    const TopWishes = await this.wishesRepository.find({
      take: 10,
      order: {
        copied: 'DESC',
      },
      relations: ['owner'],
    });
    return TopWishes;
  }
}
