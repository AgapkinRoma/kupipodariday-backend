import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { User } from './users.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hashValue } from 'src/helpers/create-hash';
import { UpdateUserDto } from './dto/update-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async singup(userDto: CreateUserDto): Promise<User> {
    const existUser = await this.userRepository.findOne({
      where: { email: userDto.email },
    });
    if (existUser) {
      throw new BadRequestException('oshibka');
    }
    const { password } = userDto;
    const user = await this.userRepository.create({
      ...userDto,
      password: await hashValue(password),
    });
    return this.userRepository.save(user);
  }

  async findById(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  findOne(options: FindOneOptions<User>) {
    return this.userRepository.findOne(options);
  }

  async updateOne(id: number, updateDto: UpdateUserDto) {
    const { password } = updateDto;
    const user = await this.findById(id);
    if (password) {
      updateDto.password = await hashValue(password);
    }
    return this.userRepository.save({ ...user, ...updateDto });
  }

  async removeOne(id: number) {
    const deletedUser = await this.userRepository.delete({ id });
    return deletedUser;
  }
}
