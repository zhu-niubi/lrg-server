import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common'
import { ProductSkuService } from './product-sku.service'
import { CreateProductSkuDto } from './dto/create-product-sku.dto'
import { UpdateProductSkuDto } from './dto/update-product-sku.dto'
import { GetProductSkuDTO } from './dto/get-product-sku.dto'

@Controller('product-sku')
export class ProductSkuController {
  constructor(private readonly productSkuService: ProductSkuService) {}

  @Post()
  create(@Body() createProductSkuDto: CreateProductSkuDto) {
    return this.productSkuService.create(createProductSkuDto)
  }

  @Get()
  findAll(@Query() query: GetProductSkuDTO) {
    return this.productSkuService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productSkuService.findOne(+id)
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductSkuDto: UpdateProductSkuDto,
  ) {
    return this.productSkuService.update(+id, updateProductSkuDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productSkuService.remove(+id)
  }
}
