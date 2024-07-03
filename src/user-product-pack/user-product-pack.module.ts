import { Module } from '@nestjs/common';
import { UserProductPackService } from './user-product-pack.service';
import { UserProductPackController } from './user-product-pack.controller';

@Module({
  controllers: [UserProductPackController],
  providers: [UserProductPackService]
})
export class UserProductPackModule {}
