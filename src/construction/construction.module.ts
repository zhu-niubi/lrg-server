import { Module } from '@nestjs/common'
import { ConstructionService } from './construction.service'
import { ConstructionController } from './construction.controller'
import { WxappModule } from 'src/wxapp/wxapp.module'
@Module({
  imports: [WxappModule],
  controllers: [ConstructionController],
  providers: [ConstructionService],
  exports: [ConstructionService],
})
export class ConstructionModule {}
