import { PartialType } from '@nestjs/mapped-types';
import { CreateProductPackDto } from './create-product-pack.dto';

export class UpdateProductPackDto extends PartialType(CreateProductPackDto) {}
