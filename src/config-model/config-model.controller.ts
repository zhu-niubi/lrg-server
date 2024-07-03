import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Put,
  Delete,
} from '@nestjs/common'
import { Response } from 'src/lib/response'
import { Roles } from 'src/lib/roles'
import { ConfigModelService } from './config-model.service'
import { CreateConfigModelDto } from './dto/create-config-model.dto'
import { GetConfigModelDto } from './dto/get-config-model.dto'
import { UpdateConfigModelDto } from './dto/update-config-model.dto'
import { Public } from 'src/lib/util'

@Controller('/config_model')
export class ConfigModelController {
  constructor(private configModelService: ConfigModelService) {}

  @Get()
  @Public()
  async getAll(
    @Query()
    query: GetConfigModelDto,
  ) {
    const result = await this.configModelService.getAll(query)
    return Response.Success(result)
  }

  @Post()
  @Roles(['admin'])
  async addOne(
    @Body()
    body: CreateConfigModelDto,
  ) {
    await this.configModelService.addOne(body)
    return Response.Success()
  }
  @Put('/:id')
  @Roles(['admin'])
  async editOne(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: UpdateConfigModelDto,
  ) {
    const result = await this.configModelService.editOne(body, id)
    return Response.Success(result)
  }
  @Delete('/:id')
  @Roles(['admin'])
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.configModelService.deleteOne(id)
    return Response.Success(result)
  }
}
