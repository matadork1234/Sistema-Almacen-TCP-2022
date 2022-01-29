import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JWT_SECRET } from 'src/config/constant';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthJwtGuard } from './guards/auth-jwt.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => (
        {
          secret: config.get<string>(JWT_SECRET),
          signOptions: {
            expiresIn: '60m'
          }
        }
      )
    })
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthJwtGuard, AuthService]
})
export class AuthModule {}
