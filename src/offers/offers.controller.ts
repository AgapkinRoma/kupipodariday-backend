import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthUser } from 'src/decorators/user.decorator';
import { User } from 'src/users/users.entity';
import { OffersService } from './offers.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @AuthUser() user: User,
  ) {
    return this.offersService.createOffer(createOfferDto, user.id);
  }
  @Get()
  async findAllOffers() {
    return this.offersService.findAllOffers();
  }
  @Get(':id')
  async findOfferById(@Param('id') id: number) {
    return this.offersService.findOfferById(id);
  }
}
