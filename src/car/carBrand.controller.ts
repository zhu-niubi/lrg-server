import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Put,
  Delete,
} from '@nestjs/common'
import { Response } from 'src/lib/response'
import { Roles } from 'src/lib/roles'
import { CarService } from './car.service'
import { CreateCarBrandDTO } from './dto/create-carBrand.dto'
import { GetCarBrand } from './dto/get-carBrand.dto'
import { UpdateCarBrandDto } from './dto/update-carBrand.dto'

@Controller('/car_brand')
export class CarBrandController {
  constructor(private carService: CarService) {}

  @Get()
  @Roles(['admin', 'client', 'store'])
  async getAll(
    @Query()
    query: GetCarBrand,
  ) {
    const result = await this.carService.getCarBrandAll(query)
    return Response.Success(result)
  }

  @Post('')
  @Roles(['admin', 'store'])
  async addOne(
    @Body()
    body: CreateCarBrandDTO,
  ) {
    try {
      await this.carService.addCarBrandOne(body)
      return Response.Success()
    } catch (err) {
      if (err?.meta?.target === 'unique') {
        return Response.Fail('该汽车品牌已存在')
      }
      throw Error(err)
    }
  }
  @Put('/:id')
  @Roles(['admin'])
  async editOne(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: UpdateCarBrandDto,
  ) {
    try {
      const result = await this.carService.editCarBrandOne(body, id)
      return Response.Success(result)
    } catch (err) {
      if (err?.meta?.target === 'unique') {
        return Response.Fail('该汽车品牌已存在')
      }
      throw Error(err)
    }
  }
  @Delete('/:id')
  @Roles(['admin'])
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.carService.deleteCarBrandOne(id)
    return Response.Success(result)
  }
}
