import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { User } from './users.model';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/updateUser.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRipository: typeof User,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

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

  async getUserByName(nickname: string) {
    return await this.userRipository.findOne({ where: { nickname } });
  }

  async getUsersByEmail(email: string) {
    return await this.userRipository.findOne({ where: { email } });
  }

  async getUsersByUuid(uuid: string) {
    return await this.userRipository.findOne({ where: { uuid } });
  }

  async updateUser(dto: UpdateUserDto, uuid: string) {
    const user = await this.getUsersByUuid(uuid);
    for (let prop in dto) {
      user[prop] = dto[prop];
    }
    if ("password" in dto) user.password = await bcrypt.hash(dto.password, 3);
    return user.save()
  }

  async deleteUser(uuid: string) {
    const user = await this.getUsersByUuid(uuid);
    this.authService.logout(uuid)
    user.destroy()
  }
}