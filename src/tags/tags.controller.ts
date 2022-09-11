import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { Token } from 'src/auth/decorators/token.decorator';
import { AuthUser } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { User } from 'src/users/users.model';
import { CreateTagDto } from './dto/createTag.dto';
import { FindByParamsDto } from './dto/findByParams.dto';
import { UpdateTagDto } from './dto/updateTag.dto';
import { TagsService } from './tags.service';

@UseGuards(JwtAuthGuard)
@Controller('tag')
export class TagsController {
  constructor(private tagService: TagsService) {}

  @Post()
  create(@AuthUser() user: User, @Body() dto: CreateTagDto) {
    return this.tagService.createTag(user.uuid, dto);
  }

  @Get("/:id")
  getOne(@Param("id") id: number) {
    return this.tagService.getTagById(id);
  }

  @Get()
  getByParams(@Query() params: FindByParamsDto) {
    return this.tagService.getTagByParams(params);
  }

  @Put("/:id")
  update(@Body() dto: UpdateTagDto, @Param("id") id: number, @Token() token: string) {
    return this.tagService.put(dto, token, id);
  }

  @Delete("/:id")
  delete(@Token() token: string, @Param("id") id: number) {
    return this.tagService.delete(token, id);
  }
}

