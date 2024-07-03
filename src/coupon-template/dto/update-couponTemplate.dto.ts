import { PartialType } from '@nestjs/mapped-types'
import { CreateCouponTemplateDTO } from './create-couponTemplate.dto'

export class UpdateCouponTemplateDTO extends PartialType(
  CreateCouponTemplateDTO,
) {}
