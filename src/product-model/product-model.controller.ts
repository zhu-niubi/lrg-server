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
  Injectable,
} from '@nestjs/common'
import { Response } from 'src/lib/response'
import { Roles } from 'src/lib/roles'
import { CreateProductModelDto } from './dto/create-product-model.dto'
import { GetProductModelDto } from './dto/get-product-model.dto'
import { UpdateProductModelDto } from './dto/update-product-model.dto'
import { ProductModelService } from './product-model.service'

@Controller('/product_model')
@Injectable()
export class ProductModelController {
  constructor(private productModelService: ProductModelService) {}

  @Get()
  @Roles(['admin', 'store'])
  async getAll(
    @Query()
    query: GetProductModelDto,
  ) {
    const result = await this.productModelService.getAll(query)

    return Response.Success(result)
  }

  @Post()
  @Roles(['admin'])
  async addOne(
    @Body()
    body: CreateProductModelDto,
  ) {
    const result = await this.productModelService.addOne(body)
    return Response.Success(result)
  }
  @Put('/:id')
  @Roles(['admin'])
  async editOne(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: UpdateProductModelDto,
  ) {
    const result = await this.productModelService.editOne(body, id)
    return Response.Success(result)
  }
  @Delete('/:id')
  @Roles(['admin'])
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.productModelService.deleteOne(id)
    return Response.Success(result)
  }
}
