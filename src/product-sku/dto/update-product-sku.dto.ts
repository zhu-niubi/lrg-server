import { PartialType } from '@nestjs/mapped-types';
import { CreateProductSkuDto } from './create-product-sku.dto';

export class UpdateProductSkuDto extends PartialType(CreateProductSkuDto) {}
