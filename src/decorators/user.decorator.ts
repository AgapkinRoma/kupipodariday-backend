import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/users/users.entity';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    console.log(request.user);

    return request.user;
  },
);
