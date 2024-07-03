import { PartialType } from '@nestjs/mapped-types';
import { CreateConstructionImageDto } from './create-construction-image.dto';

export class UpdateConstructionImageDto extends PartialType(CreateConstructionImageDto) {}
