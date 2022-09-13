import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/users/users.model';
import { CreateTagDto } from './dto/createTag.dto';
import { FindByParamsDto } from './dto/findByParams.dto';
import { UpdateTagDto } from './dto/updateTag.dto';
import { TagsService } from './tags.service';

@ApiTags("Теги")
@UseGuards(JwtAuthGuard)
@Controller('tag')
export class TagsController {
  constructor(private tagService: TagsService) {}


  @ApiOperation({summary: 'Создание нового тега'})
  @Post()
  create(@AuthUser() user: User, @Body() dto: CreateTagDto) {
    return this.tagService.createTag(user.uuid, dto);
  }

  @ApiOperation({summary: 'Получить один тег по id'})
  @Get("/:id")
  getOne(@Param("id") id: number) {
    return this.tagService.getTagById(id);
  }

  @ApiOperation({summary: 'Получить список тегов по параметрам'})
  @Get()
  getByParams(@Query() params: FindByParamsDto) {
    return this.tagService.getTagByParams(params);
  }

  @ApiOperation({summary: 'Обновить поля конкретного тега по id'})
  @Put("/:id")
  update(@Body() dto: UpdateTagDto, @Param("id") id: number, @AuthUser() user: User) {
    return this.tagService.put(dto, user.uuid, id);
  }

  @ApiOperation({summary: 'Удалить добавленый тег по id'})
  @Delete("/:id")
  delete(@AuthUser() user: User, @Param("id") id: number) {
    return this.tagService.deleteAddedTag(user.uuid, id);
  }
}

