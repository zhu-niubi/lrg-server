import { Controller, Get, Request } from '@nestjs/common'
import { Response } from 'src/lib/response'
import { Roles } from 'src/lib/roles'
import { CouponTemplateService } from './coupon-template.service'

@Controller('/coupon_class')
export class CouponClassController {
  constructor(private couponTemplateService: CouponTemplateService) {}

  @Get()
  @Roles(['client'])
  async getAll(@Request() request) {
    const result = (
      await this.couponTemplateService.getCouponClass(request.user.id)
    ).reduce(
      (prev, next) =>
        !prev.find(i => i.id === next.id) ? [...prev, next] : prev,
      [],
    )
    return Response.Success(result)
  }
}
