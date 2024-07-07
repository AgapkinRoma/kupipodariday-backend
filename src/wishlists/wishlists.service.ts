import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WishList } from './wishlists.entity';
import { In, Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { Wish } from 'src/wishes/wishes.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishList)
    private readonly wishlistRepository: Repository<WishList>,
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
  ) {}

  async createWishlist(createWishlistDto: CreateWishlistDto, userId: number) {
    const { wishesId } = createWishlistDto;
    const arrayWishesId = await this.wishRepository.findByIds(wishesId);
    const wishlist = await this.wishlistRepository.create({
      ...createWishlistDto,
      user: { id: userId },
      wishes: arrayWishesId,
    });
    return this.wishlistRepository.save(wishlist);
  }
  async findAllWishlist() {
    const wishlists = await this.wishlistRepository.find({
      relations: ['user', 'wishes'],
    });
    if (wishlists.length === 0) {
      throw new NotFoundException(`Еще не было созданно ни одного вишлиста`);
    }
    return wishlists;
  }
  async findWishlistById(id: number) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['wishes'],
    });
    if (!wishlist) {
      throw new NotFoundException(`Вишлист по указанному id ${id} не найден`);
    }
    return wishlist;
  }
  async deleteWishlistById(id: number, userId: number) {
    const wishlist = await this.wishlistRepository.findOne({ where: { id } });
    if (!wishlist) {
      throw new NotFoundException(`Вишлист по указанному id ${id} не найден`);
    }
    if (wishlist.user.id !== userId) {
      throw new ForbiddenException(`Вы не удалить чужой вишлист`);
    }
    await this.wishlistRepository.delete(wishlist.id);
    return { message: `Вишлист с ${id} успешно удален` };
  }
  async updateWishlistData(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['wishes'],
    });
    const wishes = await this.wishRepository.findByIds(
      updateWishlistDto.wishesId,
    );
    if (!wishlist) {
      throw new NotFoundException(`Вишлист по указанному id ${id} не найден`);
    }
    if (wishlist.user.id !== userId) {
      throw new ForbiddenException(`Вы не можете редактировать чужой вишлист`);
    }
    return this.wishlistRepository.save({
      ...wishlist,
      name: updateWishlistDto.name,
      image: updateWishlistDto.image,
      wishes: wishes,
    });
  }
}
