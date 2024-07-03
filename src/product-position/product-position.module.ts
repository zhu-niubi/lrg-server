import { Module } from '@nestjs/common'
import { ProductPositionService } from './product-position.service'
import { ProductPositionController } from './product-position.controller'

@Module({
  controllers: [ProductPositionController],
  providers: [ProductPositionService],
  exports: [ProductPositionService],
})
export class ProductPositionModule {}
