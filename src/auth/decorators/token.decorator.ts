import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.user.token;
  }
);