import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from './token.model';
import { User } from 'src/users/users.model';
import { JWT_EXPIRES_IN, JWT_SECRET_KEY } from 'src/consts/consts';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: {
        expiresIn: JWT_EXPIRES_IN
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
