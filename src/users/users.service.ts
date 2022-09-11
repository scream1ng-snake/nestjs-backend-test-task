import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { Token } from 'src/auth/token.model';
import { Tag } from 'src/tags/tags.model';
import { User } from './users.model';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/updateUser.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserTags } from 'src/tags/dto/user-tags.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRipository: typeof User,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
    @InjectModel(Tag) private tagRepository: typeof Tag,
    @InjectModel(UserTags) private userTags: typeof UserTags,
    private sequelize: Sequelize
  ) { }

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

  async getUserByToken(token: string) {
    return await this.userRipository.findOne({
      include: [
        {
          model: Token,
          as: "tokens",
          where: { token },
          attributes: []
        },
        {
          model: Tag,
          as: "createdTag"
        }
      ],
      attributes: ["uuid", "email", "nickname"]
    })
  }

  async updateUser(dto: UpdateUserDto, uuid: string) {
    const user = await this.getUsersByUuid(uuid);
    for (let prop in dto) {
      user[prop] = dto[prop];
    }
    if ("password" in dto) user.password = await bcrypt.hash(dto.password, 3);
    return user.save()
  }

  async deleteUser(token: string) {
    const user = await this.getUserByToken(token);
    this.authService.logout(token)
    user.destroy()
  }

  async getCreatedTags(uuid: string) {
    return await this.tagRepository.findAndCountAll({ where: { creatorUuid: uuid }, attributes: ["id", "name", "sortOrder"] })
  }

  async getUserTags(uuid: string) {
    return await this.userTags.findAndCountAll({ where: { uuid }, attributes: [], include: { model: Tag, as: "tags", attributes: ["id", "name", "sortOrder"] } })
  }

  async addManyTags(uuid: string, tags: number[]) {
    let id: number
    try {
      await this.sequelize.transaction(async t => {
        const transactionHost = { transaction: t };
        const user = await this.getUsersByUuid(uuid);
        for (let i = 0; i < tags.length; i++) {
          id = tags[i];
          const tag = await this.tagRepository.findOne({ where: { id } })
          await user.$add("tags", tag.id, transactionHost)
        }
        return this.getUserTags(uuid)
      });
    } catch (err) {
      return new HttpException(`Тега с id ${id} не существует`, HttpStatus.BAD_REQUEST)
    }
  }


  async deleteTags(uuid: string, tagId: number) {
    await this.userTags.destroy({ where: { uuid, tagId } })
  }
}