import { Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/createUser.dto';
import { loginDto } from './dto/login.dto';
import { Request } from 'express';
import { Token } from './decorators/token.decorator';


@Controller()
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post("/registration")
  async registration(@Body() dto: CreateUserDto) {
    const userData = await this.authService.registration(dto);
    return userData;
  }

  @Post("/login")
  async login(@Body() dto: loginDto) {
    const data = await this.authService.login(dto);
    return data;
  }

  @Get("/logout")
  logout(@Token() token: string) {
    return this.authService.logout(token);
  }


  @Get("/refresh")
  async refresh(@Token() token: string) {
    return await this.authService.refresh(token);
  }
}
