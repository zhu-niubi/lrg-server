import { Module } from '@nestjs/common'
import { WxappService } from './wxapp.service'

@Module({
  providers: [WxappService],
  exports: [WxappService],
})
export class WxappModule {}
