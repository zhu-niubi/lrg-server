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
  Request,
} from '@nestjs/common'
import { Response } from 'src/lib/response'
import { OrderService } from 'src/order/order.service'
import { GetOrderDTO } from 'src/order/dto/get-order.dto'
import { CreateOrderDTO } from 'src/order/dto/create-order.dto'
import { Roles } from 'src/lib/roles'
import { UsedOrderDTO } from './dto/used-order.dto'
import { GetOrderNumberDTO } from './dto/get-orderNumber.dto'

@Controller('/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @Roles(['admin', 'client', 'store'])
  async getAll(
    @Request() request,
    @Query()
    query: GetOrderDTO,
  ) {
    if (request.user.website === 'client') {
      query.userId = request.user.id
    }
    if (request.user.website === 'store') {
      query.storeId = request.user.storeId
    }
    const result = await this.orderService.getAll(query)
    return Response.Success(result)
  }
  @Get('/orderNumber')
  async orderNumber(
    @Query()
    query: GetOrderNumberDTO,
  ) {
    return this.orderService.getOne(undefined, query.orderNumber)
  }
  @Get('/:id')
  @Roles(['admin', 'store'])
  async getOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.orderService.getOne(id)
      return result
    } catch (err) {
      throw Error('找不到该订单号')
    }
  }

  @Post('used')
  @Roles(['admin', 'store'])
  async used(@Request() request, @Body() usedOrderDTO: UsedOrderDTO) {
    if (request.user.website === 'store') {
      usedOrderDTO.storeId = request.user.storeId
    }
    if (!usedOrderDTO.storeId) {
      throw Error('请填写门店信息')
    }
    return this.orderService.used(usedOrderDTO)
  }
  @Post()
  @Roles(['admin', 'store', 'client'])
  async addOne(
    @Request() request,
    @Body() { skuOrders, ...createOrderDTO }: CreateOrderDTO,
  ) {
    if (request.user.website === 'client') {
      createOrderDTO.userId = request.user.id
      createOrderDTO.price = 0
      createOrderDTO.otherFees = 0
    }
    if (request.user.website === 'store') {
      createOrderDTO.storeId = request.user.storeId
    }
    const result = await this.orderService.addOne({
      ...createOrderDTO,
      skuOrders: skuOrders.map(i => {
        return {
          productCount: i.productCount,
          productSkuId: i.productSkuId,
        }
      }),
    })
    return Response.Success(result)
  }
  @Put('/:id')
  @Roles(['admin'])
  async editOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() { memo }: { memo: string },
  ) {
    if (!memo) {
      throw Error('Bad request')
    }
    const result = await this.orderService.editOne({ memo }, id)
    return Response.Success(result)
  }
  @Delete('/:id')
  @Roles(['admin'])
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.orderService.deleteOne(id)
    return Response.Success(result)
  }
}
