import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
} from '@nestjs/common'
import { Response } from 'src/lib/response'
import { Roles } from 'src/lib/roles'
import { UserService } from 'src/user/user.service'
import { CreateWelfareDto } from './dto/create-welfare.dto'
import { UpdateWelfareDto } from './dto/update-welfare.dto'
import { WelfareService } from './welfare.service'

@Controller('/welfare')
export class WelfareController {
  constructor(
    private welfareService: WelfareService,
    private userService: UserService,
  ) {}

  @Get()
  @Roles(['admin', 'store', 'client'])
  async getAll(@Request() request) {
    if (request.user.website === 'client') {
      const { level } = await this.userService.findOneUser({
        id: request.user.id,
      })
      const result = await this.welfareService.getWelfareAll(level)
      return Response.Success(result)
    }
    const result = await this.welfareService.getWelfareAll()
    return Response.Success(result)
  }
  @Post()
  @Roles(['admin'])
  async addImage(
    @Body()
    body: CreateWelfareDto,
  ) {
    const result = await this.welfareService.add(body)
    return Response.Success(result)
  }
  @Put('/:id')
  @Roles(['admin'])
  async editImage(
    @Body()
    body: UpdateWelfareDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const result = await this.welfareService.editOne(body, id)
    return Response.Success(result)
  }
  @Delete('/:id')
  @Roles(['admin'])
  async deleteImage(@Param('id', ParseIntPipe) id: number) {
    const result = await this.welfareService.deleteOne(id)
    return Response.Success(result)
  }
}
