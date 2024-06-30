import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verifyHash } from 'src/helpers/create-hash';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne({
      select: { username: true, password: true, id: true },
      where: { username },
    });
    if (user && (await verifyHash(password, user.password))) {
      const { password, ...data } = user;
      return data;
    }
    return null;
  }
  async login(user: User) {
    const { username, id: sub } = user;
    return {
      access_token: await this.jwtService.signAsync({ username, sub }),
    };
  }
}
