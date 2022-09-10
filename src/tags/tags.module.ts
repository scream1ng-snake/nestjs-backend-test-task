import { forwardRef, Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { UsersModule } from 'src/users/users.module';
import { Tag } from './tags.model';
import { User } from 'src/users/users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [TagsService],
  
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([Tag, User])
  ],
  controllers: [TagsController],
  exports: [TagsService]
})
export class TagsModule {}
