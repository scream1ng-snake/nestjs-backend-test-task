import { Body, Controller, Delete, Get, Put, UseGuards } from '@nestjs/common';
import { Token } from 'src/auth/decorators/token.decorator';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  get(@Token() token: string) {
    return this.usersService.getUserByToken(token)
  }

  @Put()
  put(@Body() dto: UpdateUserDto, @Token() token: string) {
    return this.usersService.put(dto, token)
  }

  @Delete()
  delete(@Token() token: string) {
    return this.usersService.delete(token)
  }


}

