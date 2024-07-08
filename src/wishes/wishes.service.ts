import {
  ConflictException,
  ForbiddenException,
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
    if (ownerWishes.length === 0) {
      throw new NotFoundException(`У данного пользователя отсутствуют подарки`);
    }
    return ownerWishes;
  }

  async getWishById(id: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['offers'],
    });
    if (!wish) {
      throw new NotFoundException(`Подарок по указанному id ${id} не найден`);
    } else {
      return wish;
    }
  }

  async updateWishData(
    id: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!wish) {
      throw new NotFoundException(`Подарок по указанному id ${id} не найден`);
    }
    if (wish.owner.id !== userId) {
      throw new ForbiddenException(`Вы не можете редактировать чужой подарок`);
    }
    if (wish.raised > 0) {
      throw new ForbiddenException(
        `На подарок уже скинулись,поэтому его нельзя редактировать`,
      );
    }
    return this.wishesRepository.save({ ...wish, ...updateWishDto });
  }

  async deleteWish(id: number, userId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!wish) {
      throw new NotFoundException(`Подарок по указанному id ${id} не найден`);
    }
    if (wish.owner.id !== userId) {
      throw new ForbiddenException(`Вы не можете удалить чужой подарок`);
    }
    await this.wishesRepository.delete(wish.id);
    return { message: `Подарок с ${id} успешно удален` };
  }

  async findAllWishes() {
    const wishes = await this.wishesRepository.find({});
    if (wishes.length === 0) {
      throw new NotFoundException(`Еще не было созданно ни одного подарка`);
    }
    return wishes;
  }

  async copyWish(id: number, userId: number) {
    const wishToCopy = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    const existWishToCopy = await this.wishesRepository.findOneBy({
      name: wishToCopy.name,
      owner: { id: userId },
    });
    if (existWishToCopy) {
      throw new ConflictException(`Вы уже копировали к себе этот подарок`);
    }
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
