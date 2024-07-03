import { Module } from '@nestjs/common'
import { RecommendService } from './recommend.service'
import { RecommendController } from './recommend.controller'
import { CouponModule } from 'src/coupon/coupon.module'

@Module({
  imports: [CouponModule],
  controllers: [RecommendController],
  providers: [RecommendService],
  exports: [RecommendService],
})
export class RecommendModule {}
