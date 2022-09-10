import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from './token.model';
import { User } from 'src/users/users.model';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: 'SECRET',
      signOptions: {
        expiresIn: '30m'
      },
    }),
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([Token, User])
  ],
  exports: [
    AuthService,
    JwtModule
  ]
})
export class AuthModule {}
