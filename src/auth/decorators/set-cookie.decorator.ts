import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SetCookie = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse();
    return (key: string, value: string, age: string, httpOnly: boolean = true) => {
      let maxAge = parseInt(age.match(/\d+/).toString()); 
      const time = age.substring(age.length - 1)
      switch(time) {
        case "s": maxAge *= 1000; break;
        case "m": maxAge *= 1000 * 60; break;
        case "h": maxAge *= 1000 * 60 * 60; break;
        case "d": maxAge *= 1000 * 60 * 60 * 24; break;
      }
      console.log(key, value, {maxAge, httpOnly})

      response.cookie(key, value, {maxAge, httpOnly});
    }
  },
);
