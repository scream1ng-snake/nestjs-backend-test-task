import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { Token } from 'src/auth/token.model';
import { Tag } from 'src/tags/tags.model';
import { User } from './users.model';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/updateUser.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRipository: typeof User, @Inject(forwardRef(() => AuthService)) private authService: AuthService) {}

  async createUser(dto: CreateUserDto) { 
    const user = await this.userRipository.create(dto);
    return user;
  }

  async getAllUsers() {
    const users = await this.userRipository.findAll({
      attributes: ["uuid", "email", "nickname"]
    });
    return users;
  }

  async getUsersByEmail(email: string) {
    return await this.userRipository.findOne({where: {email}});
  }

  async getUserByToken(token: string) {
    return await this.userRipository.findOne({
      include: [
        {
          model: Token, 
          as: "tokens", 
          where: {token}, 
          attributes: []
        },
        {
          model: Tag
        }
      ], 
      attributes: ["uuid", "email", "nickname"]})
  }

  async put(dto: UpdateUserDto, token: string) {
    const user = await this.getUserByToken(token);
    for(let prop in dto) {
      user[prop] = dto[prop];
    }
    
    if("password" in dto) user.password = await bcrypt.hash(dto.password, 3);
    return user.save()
  }

  async delete(token) {
    const user = await this.getUserByToken(token);
    this.authService.logout(token)
    user.destroy()
  }

}
