import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { Response } from 'src/lib/response'
import { CouponTemplateService } from 'src/coupon-template/coupon-template.service'
import { Roles } from 'src/lib/roles'
import { GetCouponTemplateDTO } from './dto/get-couponTemplate.dto'
import { CreateCouponTemplateDTO } from './dto/create-couponTemplate.dto'
import { UpdateCouponTemplateDTO } from './dto/update-couponTemplate.dto'

@Controller('/coupon_template')
export class CouponTemplateController {
  constructor(private couponTemplateService: CouponTemplateService) {}
  @Get()
  @Roles(['admin', 'store', 'client'])
  async getAll(
    @Query()
    query: GetCouponTemplateDTO,
  ) {
    const result = await this.couponTemplateService.getAll(query)
    return result ? { ...Response.Success(result) } : { ...Response.Fail('') }
  }

  @Post()
  @Roles(['admin', 'store'])
  async addCouponTemplate(
    @Body()
    body: CreateCouponTemplateDTO,
  ) {
    await this.couponTemplateService.addCouponTemplate(body)
    return Response.Success()
  }
  @Put('/:id')
  @Roles(['admin', 'store'])
  async editCouponTemplate(
    @Body()
    body: UpdateCouponTemplateDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result = await this.couponTemplateService.editCouponTemplate(body, id)
    return result ? { ...Response.Success() } : { ...Response.Fail('修改失败') }
  }
  @Delete('/:id')
  @Roles(['admin', 'store'])
  async delOne(@Param('id', ParseIntPipe) id: number) {
    await this.couponTemplateService.delCouponTemplate(id)
    return { ...Response.Success() }
  }
}
