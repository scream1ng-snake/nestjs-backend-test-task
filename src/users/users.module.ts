import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Tag } from 'src/tags/tags.model';
import { User } from './users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserTags } from 'src/tags/dto/user-tags.model';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    TagsModule,
    SequelizeModule.forFeature([User, Tag, UserTags]),
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService]
})
export class UsersModule {}
