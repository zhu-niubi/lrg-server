import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  ParseIntPipe,
  Param,
  Delete,
} from '@nestjs/common'
import { Response } from 'src/lib/response'
import { ImageService } from './image.service'
import { GetImageDto } from './dto/get-image.dto'
import { CreateImageDto } from './dto/create-image.dto'
import { UpdateImageDto } from './dto/update-image.dto'
import { Roles } from 'src/lib/roles'
import { Public } from 'src/lib/util'
@Controller('/image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Get()
  @Public()
  async getImage(
    @Query()
    query: GetImageDto,
  ) {
    const result = await this.imageService.getImageAll(query)
    return Response.Success(result)
  }
  @Post()
  @Roles(['admin'])
  async addImage(@Body() body: CreateImageDto) {
    const result = await this.imageService.addImage(body)
    return Response.Success(result)
  }
  @Put('/:id')
  @Roles(['admin'])
  async editImage(
    @Body() body: UpdateImageDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result = await this.imageService.editOne(body, id)
    return Response.Success(result)
  }
  @Delete('/:id')
  @Roles(['admin'])
  async deleteImage(@Param('id', ParseIntPipe) id: number) {
    const result = await this.imageService.deleteOne(id)
    return Response.Success(result)
  }
}
