import {
  Controller,
  Get,
  UsePipes,
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
import { CreateProductPositionDto } from './dto/create-product-position.dto'
import { GetProductPositionDto } from './dto/get-product-position.dto'
import { UpdateProductPositionDto } from './dto/update-product-position.dto'
import { ProductPositionService } from './product-position.service'

@Controller('/product_position')
export class ProductPositionController {
  constructor(private positionService: ProductPositionService) {}

  @Get('')
  @Roles(['admin', 'store'])
  async getAll(
    @Query()
    query: GetProductPositionDto,
  ) {
    const result = await this.positionService.getAll(query)

    return Response.Success(result)
  }

  @Post('')
  @Roles(['admin'])
  async addOne(
    @Body()
    body: CreateProductPositionDto,
  ) {
    const result = await this.positionService.addOne(body)
    return Response.Success(result)
  }
  @Put('/:id')
  @Roles(['admin'])
  async editOne(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: UpdateProductPositionDto,
  ) {
    const result = await this.positionService.editOne(body, id)
    return Response.Success(result)
  }
  @Delete('/:id')
  @Roles(['admin'])
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.positionService.deleteOne(id)
    return Response.Success(result)
  }
}
