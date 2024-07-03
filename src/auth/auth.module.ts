import { Global, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './jwt.strategy'

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.appEnv + process.env.AppSecret,
      signOptions: { expiresIn: '7day' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
