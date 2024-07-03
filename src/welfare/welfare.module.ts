import { Module } from '@nestjs/common'
import { WelfareService } from './welfare.service'
import { WelfareController } from './welfare.controller'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [UserModule],
  controllers: [WelfareController],
  providers: [WelfareService],
})
export class WelfareModule {}
