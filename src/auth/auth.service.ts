import { forwardRef, HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/sequelize';
import { loginDto } from './dto/login.dto';
import { User } from 'src/users/users.model';
import { CreateUserDto } from './dto/createUser.dto';
import { UsersService } from 'src/users/users.service';
import { Token } from './token.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    @InjectModel(Token) private tokenRepository: typeof Token,
    @Inject(forwardRef(() => UsersService)) private userService: UsersService, 
    private jwtService: JwtService, 
  ) {}

  async registration(dto: CreateUserDto) {
    const candidate = await this.userService.getUsersByEmail(dto.email);
    if (candidate) {
      throw new HttpException(`Пользователь с email ${dto.email} существует`, HttpStatus.BAD_REQUEST);
    };
    const hashPassword = await bcrypt.hash(dto.password, 3);
    const user = await this.userService.createUser({...dto, password: hashPassword});
    const tokens = this.generateToken(user);
    await this.saveToken(user.uuid, tokens.refreshToken);
    return tokens
  }

  async login(dto: loginDto) {
    const user = await this.validateUser(dto);
    const tokens = this.generateToken(user);
    await this.saveToken(user.uuid, tokens.refreshToken);
    return tokens;
  }

  private generateToken(user: User) {
    const payload = {
      email: user.email, 
      uuid: user.uuid,
    }
    return {
      accessTokem: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {expiresIn: "15d"})
    };
  }

  private async validateUser(dto: loginDto) {
    const user = await this.userService.getUsersByEmail(dto.email);
    if (!user) {throw new HttpException("Неверный email пользователя", HttpStatus.BAD_REQUEST)};
    const passwordEquals = await bcrypt.compare(dto.password, user.password);
    if (!passwordEquals) {throw new HttpException("Неверный пароль", HttpStatus.BAD_REQUEST)};
    if (user && passwordEquals) {
      return user;
    }
    throw new HttpException("Внутренняя ошибка сервера" ,HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async logout(uuid: string) {
    return await this.tokenRepository.destroy({where: {uuid}})
  }

  async refresh(token: string) {
    const user = await this.validateToken(token);
    const userData = await this.userService.getUsersByEmail(user.email);
    const tokenData = await this.tokenRepository.findOne({where: {token}});
    if(!userData || !tokenData) {throw new HttpException("Не авторизован", HttpStatus.UNAUTHORIZED)};
    const { refreshToken } = this.generateToken(userData); // <-
    await this.saveToken(userData.uuid, refreshToken);
    return {refreshToken};
  }

  private async saveToken(uuid: string, token: string) {
    const tokenData = await this.tokenRepository.findOne({where: {uuid}})
    if (tokenData) {
      tokenData.token = token;
      return tokenData.save();
    };
    const newToken = await this.tokenRepository.create({uuid, token});
    return newToken;
  }

  
  async validateToken(token: string) {
    if(!token) throw new HttpException("Не авторизован", HttpStatus.UNAUTHORIZED)
    const data = this.jwtService.verify(token);
    return data;
  };
}
