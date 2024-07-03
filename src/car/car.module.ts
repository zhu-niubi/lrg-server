import { Module } from '@nestjs/common'
import { CarService } from './car.service'
import { CarController } from './car.controller'
import { CarBrandController } from './carBrand.controller'

@Module({
  controllers: [CarController, CarBrandController],
  providers: [CarService],
})
export class CarModule {}
