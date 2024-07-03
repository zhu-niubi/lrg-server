import { PartialType } from '@nestjs/mapped-types';
import { CreateRecommendDto } from './create-recommend.dto';

export class UpdateRecommendDto extends PartialType(CreateRecommendDto) {}
