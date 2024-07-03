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
import { CreateCarDto } from './dto/create-car.dto'
import { GetCarDto } from './dto/get-car.dto'
import { UpdateCarDto } from './dto/update-car.dto'

@Controller('/car')
export class CarController {
  constructor(private carService: CarService) {}

  @Get()
  @Roles(['admin', 'store', 'client'])
  async getAll(
    @Query()
    query: GetCarDto,
  ) {
    const result = await this.carService.getCarAll(query)
    return result
  }

  @Roles(['admin', 'store'])
  @Post()
  async addOne(
    @Body()
    body: CreateCarDto,
  ) {
    try {
      const result = await this.carService.addCarOne(body)
      return Response.Success(result)
    } catch (err) {
      if (err?.meta?.target === 'name') {
        return Response.Fail('该汽车型号已存在')
      }
      throw Error(err)
    }
  }
  @Put('/:id')
  @Roles(['admin'])
  async editOne(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: UpdateCarDto,
  ) {
    try {
      const result = await this.carService.editCarOne(body, id)
      return Response.Success(result)
    } catch (err) {
      if (err?.meta?.target === 'name') {
        return Response.Fail('该汽车型号已存在')
      }
      throw Error(err)
    }
  }
  @Delete('/:id')
  @Roles(['admin'])
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.carService.deleteCarOne(id)
    return Response.Success(result)
  }
}
