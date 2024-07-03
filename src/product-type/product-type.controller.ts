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
import { CreateProductTypeDto } from './dto/create-product-type.dto'
import { GetProductTypeDto } from './dto/get-product-type.dto'
import { UpdateProductTypeDto } from './dto/update-product-type.dto'
import { ProductTypeService } from './product-type.service'
import { Public } from 'src/lib/util'

@Controller('/product_type')
export class ProductTypeController {
  constructor(private productTypeService: ProductTypeService) {}

  @Get()
  @Public()
  async getAll(
    @Query()
    query: GetProductTypeDto,
  ) {
    const result = await this.productTypeService.getAll(query)
    return Response.Success(result)
  }

  @Post()
  @Roles(['admin'])
  async addOne(
    @Body()
    body: CreateProductTypeDto,
  ) {
    const result = await this.productTypeService.addOne(body)
    return Response.Success(result)
  }
  @Put('/:id')
  @Roles(['admin'])
  async editOne(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: UpdateProductTypeDto,
  ) {
    return await this.productTypeService
      .editOne(body, id)
      .then(() => Response.Success())
      .catch(err => Response.Fail(err))
  }
  @Delete('/:id')
  @Roles(['admin'])
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.productTypeService.deleteOne(id)
    return Response.Success(result)
  }
}
