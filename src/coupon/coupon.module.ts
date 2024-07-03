import { Module } from '@nestjs/common'
import { CouponService } from './coupon.service'
import { CouponController } from './coupon.controller'
import { SocketService } from '@controller/ws/message.gateway'
import { WxappModule } from 'src/wxapp/wxapp.module'
@Module({
  imports: [WxappModule],
  controllers: [CouponController],
  providers: [SocketService, CouponService],
  exports: [CouponService],
})
export class CouponModule {}
