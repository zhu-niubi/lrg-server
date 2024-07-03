import { IsInt } from 'class-validator'

export class SetHomeImages {
  @IsInt({ each: true })
  images: number[]
}
