import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/users.model';
import { Tag } from './tags/tags.model';
import { Token } from './auth/token.model';
import { UserTags } from './tags/dto/user-tags.model';
import { POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER } from './consts/consts';

@Module({
  imports: [
    UsersModule, 
    TagsModule, 
    AuthModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: POSTGRES_HOST,
      port: POSTGRES_PORT,
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      models: [User, Tag, Token, UserTags],
      autoLoadModels: true
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
