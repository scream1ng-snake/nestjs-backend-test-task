import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { TagsService } from 'src/tags/tags.service';
import { AddTagsDto } from './dto/addTags.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './users.model';
import { UsersService } from './users.service';

@ApiTags("Пользователи")
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private tagService: TagsService
  ) {}


  @ApiOperation({summary: 'Возращает информацию о текущем пользователе'})
  @Get()
  getMe(@AuthUser() user: User) {
    return this.usersService.getUsersByUuid(user.uuid);
  }
  

  @ApiOperation({summary: 'Обновить информацию о текущем пользователе'})
  @Put()
  put(@Body() dto: UpdateUserDto, @AuthUser() user: User) {
    return this.usersService.updateUser(dto, user.uuid);
  }


  @ApiOperation({summary: 'Удаляет текущего пользователя из базы данных'})
  @Delete()
  delete(@AuthUser() user: User) {
    return this.usersService.deleteUser(user.uuid);
  }


  @ApiOperation({summary: 'Возращает теги, созданные текущим пользователем'})
  @Get("tag/my")
  async getMyTags(@AuthUser() user: User) {
    return await this.tagService.getCreatedTags(user.uuid)
  }

  @ApiOperation({summary: 'Удаляет по id тег, созданный текущим пользователем'})
  @Delete("tag/:id")
  async deleteCreatedTag(@Param("id") id: number, @AuthUser() user: User) {
    return await this.tagService.deleteCreatedTag(user.uuid, id)
  }

  @ApiOperation({summary: 'Добавляет пользователю много тегов, если каждый из них есть в базе данных'})
  @ApiResponse({status: 200, description: "Успешно добавляет пользователю все теги"})
  @ApiResponse({status: 400, description: "Не добавляет ни одного тега, если хоть один из указанных отсутствует в базе данных"})
  @Post("tag")
  async addTags(@Body() dto: AddTagsDto, @AuthUser() user: User) {
    return await this.tagService.addManyTags(user.uuid, dto.tags)
  }
}

