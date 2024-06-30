import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Length, IsUrl } from 'class-validator';
import { User } from 'src/users/users.entity';
import { WishList } from 'src/wishlists/wishlists.entity';
import { Offer } from 'src/offers/offers.entity';
@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  name: string;

  @Column()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  raised: number;

  @Column()
  @Length(1, 1024)
  description: string;

  @Column({ type: 'int', default: 0 })
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;
  @ManyToOne(() => WishList, (wishlist) => wishlist.wishes)
  wishlist: WishList;
  @OneToMany(() => Offer, (offer) => offer.wish)
  offers: Offer[];
}
