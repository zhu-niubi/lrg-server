import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common'
import { RollService } from './roll.service'
import { CreateRollDto } from './dto/create-roll.dto'
import { UpdateRollDto } from './dto/update-roll.dto'
import { GetRollDto } from './dto/get-roll.dto'
import { Roles } from 'src/lib/roles'

@Controller('/roll')
export class RollController {
  constructor(private readonly rollService: RollService) {}

  @Post()
  @Roles(['admin'])
  create(@Body() createRollDto: CreateRollDto) {
    return this.rollService.create(createRollDto)
  }

  @Get()
  @Roles(['admin', 'store'])
  findAll(@Query() query: GetRollDto) {
    return this.rollService.findAll(query)
  }

  @Get(':id')
  @Roles(['admin'])
  findOne(@Param('id') id: string) {
    return this.rollService.findOne(+id)
  }

  @Put(':id')
  @Roles(['admin'])
  update(@Param('id') id: string, @Body() updateRollDto: UpdateRollDto) {
    return this.rollService.update(+id, updateRollDto)
  }

  @Delete(':id')
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.rollService.remove(+id)
  }
}
