import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './offers.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/wishes.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
  ) {}

  async createOffer(
    createOfferDto: CreateOfferDto,
    userId: number,
  ): Promise<Offer> {
    const { amount, wishId } = createOfferDto;
    const wish = await this.wishRepository.findOne({
      where: { id: wishId },
      relations: ['owner', 'offers'],
    });
    if (userId === wish.owner.id) {
      throw new ForbiddenException(`Вы не можете скидываться на свой подарок`);
    }

    const offer = await this.offerRepository.create({
      ...createOfferDto,
      wish: wish,
      user: { id: userId },
    });
    if (offer.amount + wish.raised > wish.price) {
      throw new ForbiddenException(
        `Сумма которую вы пытаетесь скинуть превышает сумму подарка`,
      );
    }
    wish.raised += amount;
    await this.wishRepository.save(wish);
    return this.offerRepository.save(offer);
  }
  async findAllOffers() {
    return this.offerRepository.find({
      relations: ['user'],
    });
  }
  async findOfferById(id: number) {
    const offer = await this.offerRepository.findOne({
      where: { id },
    });
    if (!offer) {
      throw new NotFoundException(`Оффер по указанному id ${id} не найден`);
    }
    return offer;
  }
}
