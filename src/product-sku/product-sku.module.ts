import { Module } from '@nestjs/common'
import { ProductSkuService } from './product-sku.service'
import { ProductSkuController } from './product-sku.controller'
import { PrismaClient } from '@prisma/client'

@Module({
  controllers: [ProductSkuController],
  providers: [ProductSkuService, PrismaClient],
})
export class ProductSkuModule {}
