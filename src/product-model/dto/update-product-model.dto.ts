import { PartialType } from '@nestjs/mapped-types';
import { CreateProductModelDto } from './create-product-model.dto';

export class UpdateProductModelDto extends PartialType(CreateProductModelDto) {}
