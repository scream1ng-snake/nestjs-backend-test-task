import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TagsModule } from './tags/tags.module';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/users.model';
import { Tag } from './tags/tags.model';
import { Token } from './auth/token.model';

@Module({
  imports: [
    UsersModule, 
    TagsModule, 
    AuthModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: "localhost",
      port: 5432,
      username: 'postgres',
      password: "root",
      database: "test-task",
      models: [User, Tag, Token],
      autoLoadModels: true
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
