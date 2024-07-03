import { Module } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileController } from './profile.controller'
import { UserModule } from 'src/user/user.module'
import { EmployeeModule } from 'src/employee/employee.module'

@Module({
  imports: [UserModule, EmployeeModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
