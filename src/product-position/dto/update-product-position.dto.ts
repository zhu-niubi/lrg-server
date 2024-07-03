import { PartialType } from '@nestjs/mapped-types';
import { CreateProductPositionDto } from './create-product-position.dto';

export class UpdateProductPositionDto extends PartialType(CreateProductPositionDto) {}
