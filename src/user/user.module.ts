import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { EmployeeModule } from 'src/employee/employee.module'
import { WxappModule } from 'src/wxapp/wxapp.module'
@Module({
  imports: [WxappModule, EmployeeModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
