import { Module } from '@nestjs/common'
import { ProductModelService } from './product-model.service'
import { ProductModelController } from './product-model.controller'

@Module({
  controllers: [ProductModelController],
  providers: [ProductModelService],
})
export class ProductModelModule {}
