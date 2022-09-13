import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { loginDto } from './dto/login.dto';
import { Cookies } from './decorators/cookie.decorator';
import { SetCookie } from './decorators/set-cookie.decorator';
import { ClearCookie } from './decorators/clear-cookie.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags("Авторизация")
@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  
  @ApiOperation({summary: 'Регистрация пользователя'})
  @ApiResponse({status: 200, description: "Возращает Access Token, добавляет в куки Refresh Token"})
  @ApiResponse({status: 400, description: "Возращает ошибку если данные не валидны"})

  @Post("/registration")
  async registration(@Body() dto: CreateUserDto, @SetCookie() SetCookie) {
    const { accessTokem, refreshToken } = await this.authService.registration(dto);
    SetCookie("refreshToken", refreshToken, "15d")
    return {accessTokem};
  }


  @ApiOperation({summary: 'Войти'})
  @ApiResponse({status: 200, description: "Возращает Access Token, добавляет в куки Refresh Token"})
  @ApiResponse({status: 400, description: "Возращает ошибку если данные не валидны"})

  @Post("/login")
  async login(@Body() dto: loginDto, @SetCookie() SetCookie) {
    const { accessTokem, refreshToken }  = await this.authService.login(dto);
    SetCookie("refreshToken", refreshToken, "15d")
    return {accessTokem};
  }


  @ApiOperation({summary: 'Выйти'})
  @ApiResponse({status: 200, description: "Разлогинивает пользователя, удаляет Refresh Token из базы данных"})
  @ApiResponse({status: 400, description: "Возращает ошибку если Refresh Token не валиден"})

  @Get("/logout")
  async logout(@Cookies("refreshToken") token: string, @ClearCookie() clearCookie) {
    const user = await this.authService.validateToken(token)
    clearCookie('refreshToken')
    return this.authService.logout(user.uuid);
  }


  @ApiOperation({summary: 'Обновить токен'})
  @ApiResponse({status: 200, description: "Добавляет в куки новый Refresh Token"})
  @ApiResponse({status: 400, description: "Возращает ошибку если Refresh Token не валиден"})

  @Get("/refresh")
  async refresh(@Cookies("refreshToken") token: string, @SetCookie() SetCookie) {
    const { refreshToken } = await this.authService.refresh(token);
    return SetCookie("refreshToken", refreshToken, "15d")
  }
}
