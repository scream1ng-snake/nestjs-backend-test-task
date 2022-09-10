import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const authHeader = request.headers.authorization;
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException({ message: 'Пользователь не авторизован' });
    };
    return token;
  }
);