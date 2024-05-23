import { Auth } from './entities/auth.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GenerateToken } from './providers/generate-token';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import config from 'src/config/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: config.jwt.secret,
        };
      },
    }),
  ],
  providers: [AuthService, GenerateToken, JwtStrategy, UserService],
  exports: [AuthService, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
})
export class AuthModule {}
