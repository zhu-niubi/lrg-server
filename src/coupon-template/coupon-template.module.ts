import { Module } from '@nestjs/common'
import { CouponTemplateService } from './coupon-template.service'
import { CouponClassController } from './couponClass.controller'
import { CouponTemplateController } from './couponTemplate.controller'

@Module({
  controllers: [CouponClassController, CouponTemplateController],
  providers: [CouponTemplateService],
  exports: [CouponTemplateService],
})
export class CouponTemplateModule {}
