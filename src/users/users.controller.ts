import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { Token } from 'src/auth/decorators/token.decorator';
import { AuthUser } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { TagsService } from 'src/tags/tags.service';
import { AddTagsDto } from './dto/addTags.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './users.model';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private tagService: TagsService
  ) {}

  @Get()
  getMe(@AuthUser() user: User) {
    return this.usersService.getUsersByUuid(user.uuid);
  }

  @Put()
  put(@Body() dto: UpdateUserDto, @AuthUser() user: User) {
    return this.usersService.updateUser(dto, user.uuid);
  }

  @Delete()
  delete(@Token() token: string) {
    return this.usersService.deleteUser(token);
  }

  @Get("tag/my")
  async getMyTags(@AuthUser() user: User) {
    return await this.tagService.getCreatedTags(user.uuid)
  }

  @Delete("tag/:id")
  async deleteTag(@Param("id") id: number, @AuthUser() user: User) {
    return await this.tagService.deleteTags(user.uuid, id)
  }

  @Post("tag")
  async addTags(@Body() dto: AddTagsDto, @AuthUser() user: User) {
    return await this.tagService.addManyTags(user.uuid, dto.tags)
  }
}

