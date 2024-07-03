import { Module } from '@nestjs/common';
import { ProductPackService } from './product-pack.service';
import { ProductPackController } from './product-pack.controller';

@Module({
  controllers: [ProductPackController],
  providers: [ProductPackService]
})
export class ProductPackModule {}
