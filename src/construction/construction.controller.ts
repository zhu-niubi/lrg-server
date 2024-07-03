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
  Request,
} from '@nestjs/common'
import { ConstructionService } from 'src/construction/construction.service'
import { Response } from 'src/lib/response'
import { Roles } from 'src/lib/roles'
import { CreateConstructionDTO } from './dto/create-construction.dto'
import { GetConstructionDTO } from './dto/get-construction.dto'
import {
  BackConstructionDTO,
  UpdateConstructionDTO,
} from './dto/update-construction.dto'
import { WxappService } from 'src/wxapp/wxapp.service'

@Controller('/construction')
export class ConstructionController {
  constructor(
    private constructionService: ConstructionService,
    private wxapp: WxappService,
  ) {}

  @Get()
  @Roles(['admin', 'store', 'client'])
  async getAll(
    @Request() request,
    @Query()
    params: GetConstructionDTO,
  ) {
    if (request.user.website === 'store') {
      params.storeId = request.user.storeId
    }
    if (request.user.website === 'client') {
      params.userId = request.user.id
    }
    const result = await this.constructionService.getAll(params)
    return Response.Success(result)
  }

  @Get('/:id')
  @Roles(['admin', 'store', 'client'])
  async getOne(@Param('id', ParseIntPipe) id: number, @Request() request) {
    let params: {
      storeId?: number
      userId?: number
    } = {}
    if (request.user.website === 'store') {
      params.storeId = request.user.storeId
    }
    if (request.user.website === 'client') {
      params.userId = request.user.id
    }
    const result = await this.constructionService.findOne({ id, ...params })
    return Response.Success(result)
  }
  @Post()
  @Roles(['admin', 'store'])
  async addOne(
    @Request() request,
    @Body()
    body: CreateConstructionDTO,
  ) {
    if (request.user.website === 'store') {
      body.storeId = request.user.storeId
    }
    const result = await this.constructionService.addOne(body)
    return Response.Success(result)
  }
  @Put('/:id')
  @Roles(['admin', 'store', 'client'])
  async editOne(
    @Request() request,
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: UpdateConstructionDTO,
  ) {
    let storeId
    if (request.user.website === 'store') {
      storeId = request.user.storeId
    }
    if (request.user.website === 'client') {
      if (![2, 6].includes(body.status)) {
        throw Error('施工单状态状态不正确')
      }
    }
    await this.constructionService.editOne(body, { id, storeId })
    return Response.Success()
  }
  @Post('/back')
  @Roles(['admin', 'store'])
  async back(
    @Request() request,
    @Body()
    body: BackConstructionDTO,
  ) {
    let storeId
    if (request.user.website === 'store') {
      storeId = request.user.storeId
    }
    return this.constructionService.back({ ...body, storeId })
  }
  @Delete('/:id')
  @Roles(['admin', 'store'])
  async deleteOne(@Param('id', ParseIntPipe) id: number, @Request() request) {
    let storeId
    if (request.user.website === 'store') {
      storeId = request.user.storeId
    }
    await this.constructionService.deleteOne(id, storeId)
    return Response.Success()
  }
}
