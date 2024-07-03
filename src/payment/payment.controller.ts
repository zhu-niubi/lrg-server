import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common'
import { PaymentService } from './payment.service'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { UpdatePaymentDto } from './dto/update-payment.dto'
import pay from './../lib/wx-pay'
import { MD5, Public } from '@lib/util'
import { PaidPaymentDto } from './dto/paid-payment.dto'

@Controller('payment')
//账单相关
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto)
  }

  @Post('/paid/:order/:sign')
  @Public()
  async paid(
    @Request() request: Request,
    @Param('order') orderNumber,
    @Param('sign') signature,
    @Body() paidPaymentDto: PaidPaymentDto,
  ) {
    const validate = await pay.verifySign({
      timestamp: request.headers['wechatpay-timestamp'],
      nonce: request.headers['wechatpay-nonce'],
      body: request.body,
      serial: request.headers['wechatpay-serial'],
      signature: request.headers['wechatpay-signature'],
      apiSecret: process.env.APIV3Secret,
    })
    if (!validate) {
      console.log('params:', {
        timestamp: request.headers['wechatpay-timestamp'],
        nonce: request.headers['wechatpay-nonce'],
        body: request.body,
        serial: request.headers['wechatpay-serial'],
        signature: request.headers['wechatpay-signature'],
        apiSecret: process.env.APIV3Secret,
      })
      console.log('request:', request)
      throw Error('验证失败')
    }
    if (MD5(orderNumber + process.env.AppSecret) === signature) {
      const result = pay.decipher_gcm<{
        out_trade_no: string
        trade_type: string
        trade_state: 'SUCCESS' | 'REFUND' | 'NOTPAY' | 'CLOSED' | 'USERPAYING'
      }>(
        paidPaymentDto.resource.ciphertext,
        paidPaymentDto.resource.associated_data,
        paidPaymentDto.resource.nonce,
        process.env.APIV3Secret,
      )
      if (result.trade_state === 'SUCCESS') {
        await this.paymentService.paid({ orderNumber: result.out_trade_no })
      }
    } else {
      console.log('订单校验码：', signature)
      console.log('订单：', orderNumber)
      throw Error('订单安全码校验失败')
    }
  }

  @Get()
  findAll() {
    return this.paymentService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id)
  }
}
