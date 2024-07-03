import { Module } from '@nestjs/common'
import { ConstructionImageService } from './construction-image.service'
import { ConstructionImageController } from './construction-image.controller'
import { WxappModule } from 'src/wxapp/wxapp.module'
@Module({
  imports: [WxappModule],
  controllers: [ConstructionImageController],
  providers: [ConstructionImageService],
})
export class ConstructionImageModule {}
