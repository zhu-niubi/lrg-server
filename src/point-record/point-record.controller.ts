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
import { PointRecordService } from './point-record.service'
import { CreatePointRecordDto } from './dto/create-point-record.dto'
import { UpdatePointRecordDto } from './dto/update-point-record.dto'
import { GetPointRecordDTO } from './dto/get-point-record.dto'
import { Roles } from 'src/lib/roles'

@Controller('point-record')
export class PointRecordController {
  constructor(private readonly pointRecordService: PointRecordService) {}

  @Post()
  @Roles(['admin', 'store'])
  create(@Body() createPointRecordDto: CreatePointRecordDto) {
    return this.pointRecordService.create(createPointRecordDto)
  }

  @Get()
  @Roles(['admin', 'store'])
  findAll(@Query() getPointRecordDTO: GetPointRecordDTO) {
    return this.pointRecordService.findAll(getPointRecordDTO)
  }

  @Get(':id')
  @Roles(['admin', 'store'])
  findOne(@Param('id') id: string) {
    return this.pointRecordService.findOne(+id)
  }

  @Put(':id')
  @Roles(['admin', 'store'])
  update(
    @Param('id') id: string,
    @Body() updatePointRecordDto: UpdatePointRecordDto,
  ) {
    return this.pointRecordService.update(+id, updatePointRecordDto)
  }

  @Delete(':id')
  @Roles(['admin', 'store'])
  remove(@Param('id') id: string) {
    return this.pointRecordService.remove(+id)
  }
}
