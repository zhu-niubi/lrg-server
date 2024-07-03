import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  Request,
} from '@nestjs/common'
import { ProductPackService } from './product-pack.service'
import { CreateProductPackDto } from './dto/create-product-pack.dto'
import { UpdateProductPackDto } from './dto/update-product-pack.dto'
import { GetProductPackDto } from './dto/get-product-pack.dto'
import { Roles } from 'src/lib/roles'
import { SendProductPackDto } from './dto/send-product-pack.dto'

@Controller('product-pack')
export class ProductPackController {
  constructor(private readonly productPackService: ProductPackService) {}

  @Post()
  @Roles(['admin'])
  create(@Body() createProductPackDto: CreateProductPackDto) {
    return this.productPackService.create(createProductPackDto)
  }

  @Post('/send')
  @Roles(['admin'])
  send(@Request() request, @Body() sendProductPackDto: SendProductPackDto) {
    if (request.user.website === 'store') {
      sendProductPackDto.storeId = request.user.storeId
    }
    sendProductPackDto.emplpyeeId = request.user.storeId
    return this.productPackService.send(sendProductPackDto)
  }

  @Get()
  @Roles(['admin', 'client', 'store'])
  findAll(@Request() request, @Query() getProductPackDto: GetProductPackDto) {
    if (request.user.website === 'client') {
      getProductPackDto.userId = request.user.id
    }
    if (request.user.website === 'store') {
      getProductPackDto.storeId = request.user.storeId
    }
    return this.productPackService.findAll(getProductPackDto)
  }

  @Get(':id')
  @Roles(['admin', 'store'])
  findOne(@Param('id') id: string) {
    return this.productPackService.findOne(+id)
  }

  @Put(':id')
  @Roles(['admin', 'store'])
  update(
    @Request() request,
    @Param('id') id: string,
    @Body() updateProductPackDto: UpdateProductPackDto,
  ) {
    if (request.user.website === 'store') {
      updateProductPackDto.applyStore = undefined
    }
    return this.productPackService.update(+id, updateProductPackDto)
  }

  @Delete(':id')
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.productPackService.remove(+id)
  }
}
