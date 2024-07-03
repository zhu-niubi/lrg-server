import { Module } from '@nestjs/common'
import { UserCarService } from './user-car.service'
import { UserCarController } from './user-car.controller'

@Module({
  controllers: [UserCarController],
  providers: [UserCarService],
})
export class UserCarModule {}
