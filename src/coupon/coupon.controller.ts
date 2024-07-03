import { SocketService } from '@controller/ws/message.gateway'
import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common'
import { Response } from 'src/lib/response'
import { Roles } from 'src/lib/roles'
import { CouponService } from './coupon.service'
import { CreateCouponVo } from './dto/create-coupon.dto'
import { GetCouponVo } from './dto/get-coupon.dto'
import { UpdateCouponDTO } from './dto/update-coupon.dto'

@Controller('/coupon')
@Injectable()
export class CouponController {
  constructor(
    private couponService: CouponService,
    private socketService: SocketService,
  ) {}
  @Get()
  @Roles(['admin', 'client', 'store'])
  async getAll(
    @Request() request,
    @Query()
    query: GetCouponVo,
  ) {
    if (request.user.website === 'client') {
      query.userId = request.user.id
    }
    if (request.user.website === 'store') {
      query.storeId = request.user.storeId
    }
    const result = await this.couponService.getAll(query)
    return Response.Success(result)
  }

  @Get('/:code')
  @Roles(['admin', 'store'])
  async getCode(@Param('code') code: string) {
    const result = await this.couponService.getOne({ code })
    if (!result) {
      throw Error('找不到该卡券')
    }
    await this.socketService.usedCoupon(result.userId, result.id, 1)
    return Response.Success(result)
  }

  @Post()
  @Roles(['admin', 'store'])
  async addCoupon(
    @Request() request,
    @Body()
    { userId, couponTemplateId, memo, count = 0, applyStore }: CreateCouponVo,
  ) {
    if (request.user.website === 'store') {
      applyStore = [request.user.storeId]
    }
    const result = await this.couponService.addMany({
      userId,
      couponTemplateId,
      memo,
      count,
      applyStore,
      employeeId: request.user.id,
    })
    return Response.Success(result)
  }
  @Put('/:id')
  @Roles(['admin', 'store'])
  async editCoupon(
    @Body()
    {
      userId,
      couponTemplateId,
      orderNumber,
      memo,
      deadline,
      applyStore,
    }: UpdateCouponDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result = await this.couponService.editCoupon(
      {
        userId,
        couponTemplateId,
        orderNumber,
        deadline,
        memo,
        applyStore: applyStore,
      },
      id,
    )
    return result ? Response.Success() : Response.Fail('修改失败')
  }

  @Post('/use_coupon')
  @Roles(['store'])
  async useCoupon(
    @Request() request,
    @Body()
    { code }: { code: string },
  ) {
    if (!code) {
      throw Error('code can not empty')
    }
    try {
      const result = await this.couponService.useCoupon(
        code,
        request.user.storeId,
      )
      result?.userId &&
        this.socketService.usedCoupon(result.userId, result.id, 2)
      return Response.Success()
    } catch (err) {
      throw Error(err)
    }
  }
  @Delete('/:id')
  @Roles(['admin', 'store'])
  async delOne(@Param('id', ParseIntPipe) id: number) {
    await this.couponService.delCoupon(id)
    return Response.Success()
  }
}
