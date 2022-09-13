import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ClearCookie = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse();
    return (key: string) => {
      response.clearCookie(key);
    }
  },
);
