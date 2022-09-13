import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/users.model';
import { Tag } from './tags/tags.model';
import { Token } from './auth/token.model';
import { UserTags } from './tags/dto/user-tags.model';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule, 
    TagsModule, 
    AuthModule,
    ConfigModule.forRoot({envFilePath: ".env"}),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Tag, Token, UserTags],
      autoLoadModels: true
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
