import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateProductSkuDto } from './dto/create-product-sku.dto'
import { GetProductSkuDTO } from './dto/get-product-sku.dto'
import { UpdateProductSkuDto } from './dto/update-product-sku.dto'

@Injectable()
export class ProductSkuService {
  constructor(private prismaService: PrismaService) {}
  create(createProductSkuDto: CreateProductSkuDto) {
    return this.prismaService.productSku.create({
      data: {
        ...createProductSkuDto,
        stock: 1,
      },
    })
  }

  findAll(query: GetProductSkuDTO) {
    return this.prismaService.findAndCount({
      tableName: 'productSku',
      pageNumber: query.pageNumber,
      pageSize: query.pageSize,
      where: {
        productId: query.productId,
      },
    })
  }

  findOne(id: number) {
    return this.prismaService.productSku.findFirst({ where: { id } })
  }

  update(id: number, updateProductSkuDto: UpdateProductSkuDto) {
    return this.prismaService.productSku.update({
      where: { id },
      data: updateProductSkuDto,
    })
  }

  remove(id: number) {
    return this.prismaService.productSku.update({
      where: { id },
      data: { status: 0 },
    })
  }
}
