import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { Paginate } from 'src/utils/paginate';
import { CreateTagDto } from './dto/createTag.dto';
import { FindByParamsDto } from './dto/findByParams.dto';
import { UpdateTagDto } from './dto/updateTag.dto';
import { UserTags } from './dto/user-tags.model';
import { Tag } from './tags.model';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag) private tagRepository: typeof Tag, 
    @InjectModel(UserTags) private userTags: typeof UserTags, 
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
    private sequelize: Sequelize
  ) {}

  async createTag(creatorUuid: string, dto: CreateTagDto) {
    return await this.tagRepository.create({ ...dto, creatorUuid})
  }

  async getTagById(id: number) {
    return await this.tagRepository.findOne({ where: { id }, include: { model: User, as: "creator", attributes: ["nickname", "uuid"] }, attributes: ["id", "name", "sortOrder"] })
  }

  async getTagByParams(params: FindByParamsDto) {
    const { sortOrder, name, page, limit } = params;
    if (!sortOrder && !name) {
      return await this.tagRepository.findAndCountAll({
        include: { model: User, as: "creator", attributes: ["nickname", "uuid"] },
        attributes: ["id", "name", "sortOrder"],
        ...Paginate(page, limit)
      })
    }

    if (!sortOrder && name) {
      return await this.tagRepository.findAndCountAll({
        where: { name },
        include: { model: User, as: "creator", attributes: ["nickname", "uuid"] },
        attributes: ["id", "name", "sortOrder"],
        ...Paginate(page, limit)
      })
    }

    if (sortOrder && !name) {
      return await this.tagRepository.findAndCountAll({
        where: { sortOrder },
        include: { model: User, as: "creator", attributes: ["nickname", "uuid"] },
        attributes: ["id", "name", "sortOrder"],
        ...Paginate(page, limit)
      })
    }

    if (sortOrder && name) {
      return await this.tagRepository.findAndCountAll({
        where: { sortOrder, name },
        include: { model: User, as: "creator", attributes: ["nickname", "uuid"] },
        attributes: ["id", "name", "sortOrder"],
        ...Paginate(page, limit)
      })
    }
  }

  async put(dto: UpdateTagDto, token: string, id: number) {
    try {
      const tag = await this.getTagById(id);
      if (!tag) return new HttpException("Тэга не существует", HttpStatus.BAD_REQUEST)
      const user = await this.userService.getUserByToken(token);
      if (user.nickname === tag.creator.nickname) {
        for (let prop in dto) {
          tag[prop] = dto[prop];
        }
        return await tag.save()
      }
      return new HttpException("Нет доступа", HttpStatus.FORBIDDEN)
    } catch (e) {
      return new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async delete(token: string, id: number) {
    const tag = await this.getTagById(id);
    if (!tag) return new HttpException("Тэга не существует", HttpStatus.BAD_REQUEST)
    const user = await this.userService.getUserByToken(token);
    if (user.nickname === tag.creator.nickname) {
      return await tag.destroy()
    }
    return new HttpException("Нет доступа", HttpStatus.FORBIDDEN)
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
        const user = await this.userService.getUsersByUuid(uuid);
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


