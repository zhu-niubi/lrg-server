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
import { Public } from 'src/lib/util'
import { CreateProductDTO } from 'src/product/dto/create-product.dto'
import { GetProductDTO } from 'src/product/dto/get-product.dto'
import { UpdateProductDTO } from 'src/product/dto/update-product.dto'
import { ProductService } from 'src/product/product.service'

@Controller('/product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  @Public()
  async getAll(
    @Query()
    query: GetProductDTO,
  ) {
    const result = await this.productService.getAll({
      ...query,
      productTypeId: query.productTypeId,
      productModelId: query.productModelId,
      pageSize: query.pageSize,
      pageNumber: query.pageNumber,
    })

    return Response.Success(result)
  }

  @Get('/:id')
  @Public()
  async getOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.productService.getOne({ productId: id })
    return Response.Success(result)
  }
  @Post()
  @Roles(['admin'])
  async addOne(
    @Body()
    body: CreateProductDTO,
  ) {
    const result = await this.productService.addOne(body)
    return Response.Success(result)
  }
  @Put('/:id')
  @Roles(['admin'])
  async editOne(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: UpdateProductDTO,
  ) {
    const result = await this.productService.editOne(body, id)
    return Response.Success(result)
  }
  @Delete('/:id')
  @Roles(['admin'])
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.productService.deleteOne(id)
    return Response.Success(result)
  }
}
