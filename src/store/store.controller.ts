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
import { StoreService } from './store.service'
import { GetStoreDTO } from './dto/get-store.dto'
import { CreateStoreDTO } from './dto/create-store.dto'
import { UpdateStoreDTO } from './dto/update-store.dto'
import { Roles } from 'src/lib/roles'
import { phoneCheck } from 'src/lib/testing'
import { Public } from 'src/lib/util'

@Controller('/store')
export class StoreController {
  constructor(private storeService: StoreService) {}
  @Get()
  @Public()
  async getImage(
    @Query()
    query: GetStoreDTO,
  ) {
    const result = await this.storeService.getAll(query)
    result.list.forEach((i: any) => {
      i.phoneNumber = phoneCheck('+86', i.phoneNumber)
        ? i.phoneNumber.slice(0, 3) + '****' + i.phoneNumber.slice(-4)
        : i.phoneNumber
    })
    return Response.Success(result)
  }
  @Get('/:id')
  @Public()
  async getOne(
    @Param('id')
    id: string,
  ) {
    const result = await this.storeService.getOne(+id)
    return result
  }
  @Post()
  @Roles(['admin'])
  async addOne(
    @Body()
    body: CreateStoreDTO,
  ) {
    await this.storeService.addOne(body)
    return Response.Success()
  }
  @Put('/:id')
  @Roles(['admin'])
  async editOne(
    @Body()
    body: UpdateStoreDTO,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.storeService.editOne(body, id)
    return Response.Success()
  }
  @Delete('/:id')
  @Roles(['admin'])
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    await this.storeService.deleteOne(id)
    return Response.Success()
  }
}
