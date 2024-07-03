import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common'
import { ConstructionImageService } from './construction-image.service'
import { CreateConstructionImageDto } from './dto/create-construction-image.dto'
import { UpdateConstructionImageDto } from './dto/update-construction-image.dto'
import { GetConstructionImageDto } from './dto/get-construction-image.dto'
import { SetHomeImages } from './dto/set-home-images.dto'
import { Public } from 'src/lib/util'

@Controller('construction-image')
export class ConstructionImageController {
  constructor(
    private readonly constructionImageService: ConstructionImageService,
  ) {}

  @Post('home')
  setImages(@Body() { images }: SetHomeImages) {
    return this.constructionImageService.setHomeImgaes(images)
  }

  @Get('home')
  @Public()
  getImages() {
    return this.constructionImageService.findHomeImages()
  }

  @Post()
  create(@Body() createConstructionImageDto: CreateConstructionImageDto) {
    return this.constructionImageService.create(createConstructionImageDto)
  }

  @Get()
  @Public()
  findAll(@Query() getConstructionImageDto: GetConstructionImageDto) {
    return this.constructionImageService.findAll(getConstructionImageDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.constructionImageService.findOne(+id)
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateConstructionImageDto: UpdateConstructionImageDto,
  ) {
    return this.constructionImageService.update(+id, updateConstructionImageDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.constructionImageService.remove(+id)
  }
}
