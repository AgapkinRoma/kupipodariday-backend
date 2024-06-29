import { IsUrl, Length } from 'class-validator';
import { User } from 'src/users/users.entity';
import { Wish } from 'src/wishes/wishes.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class WishList {
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
  @Length(1, 1500)
  description: string;

  @Column()
  @IsUrl()
  image: string;

  @OneToMany(() => Wish, (wish) => wish.wishlist)
  wishes: Wish[];
  @ManyToOne(() => User, (user) => user.wishlists)
  user: User;
}
