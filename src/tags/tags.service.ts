import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { CreateTagDto } from './dto/createTag.dto';
import { FindByParamsDto } from './dto/findByParams.dto';
import { UpdateTagDto } from './dto/updateTag.dto';
import { Tag } from './tags.model';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag) private tagRepository: typeof Tag, @Inject(forwardRef(() => UsersService)) private userService: UsersService) { }

  async createTag(token: string, dto: CreateTagDto) {
    try {
      const user = await this.userService.getUserByToken(token);
      return await this.tagRepository.create({ ...dto, creatorUuid: user.uuid })
    } catch (e) {
      return new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
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
        attributes: ["id", "name", "price", "image"],
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
}

export function Paginate(page: number = 1, length: number = 10) {
  if (page <= 0 || length <= 0) {
    throw new HttpException("Неверные параметры пагинации", HttpStatus.BAD_REQUEST)
  }
  return {
    length,
    offset: page * length - length
  }
}
