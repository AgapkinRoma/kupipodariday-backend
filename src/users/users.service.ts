import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './users.entity';
import { Equal, FindOneOptions, Like, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { hashValue } from 'src/helpers/create-hash';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signup(userDto: CreateUserDto): Promise<User> {
    const existUser = await this.userRepository.findOne({
      where: { email: userDto.email },
    });
    if (existUser) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует',
      );
    }
    const { password } = userDto;
    const hashedPassword = await hashValue(password, 10);
    const user = this.userRepository.create({
      ...userDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  async findOne(options: FindOneOptions<User>) {
    return this.userRepository.findOne(options);
  }
  async findAllUsers() {
    return this.userRepository.find({});
  }
  async findUserByUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    if (!user) {
      throw new NotFoundException(
        `Пользователь с именем ${username} не найден.`,
      );
    }
    return user;
  }

  async updateOne(id: number, updateDto: UpdateUserDto) {
    try {
      const { password } = updateDto;
      const user = await this.findById(id);
      if (password) {
        updateDto.password = await hashValue(password, 10);
      }
      return await this.userRepository.save({ ...user, ...updateDto });
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'Пользователь с таким email или username уже зарегистрирован',
        );
      }
      throw error;
    }
  }
  async findUser(query: string) {
    const user = await this.userRepository.find({
      where: [{ username: Like(`${query}`) }, { email: Like(`${query}`) }],
    });
    if (!user) {
      throw new NotFoundException(
        `Пользователь по указанному полю ${query} не найден.`,
      );
    }
    return user;
  }
}
