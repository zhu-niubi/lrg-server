import { IsInt, IsString } from 'class-validator'

export class CreateConstructionImageDto {
  @IsString({ each: true })
  src: string[]
  @IsInt()
  constructionId: number
  @IsInt()
  productId: number
}
