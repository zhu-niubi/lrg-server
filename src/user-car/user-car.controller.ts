import {
  Controller,
  Get,
  Put,
  Param,
  ParseIntPipe,
  Body,
  Post,
  Query,
  Delete,
  Request,
  Injectable,
} from '@nestjs/common'
import { Response } from 'src/lib/response'
import { UserCarService } from './user-car.service'
import { GetUserCarDto } from './dto/get-user-car.dto'
import { CreateUserCarDto } from './dto/create-user-car.dto'
import { UpdateUserCarDto } from './dto/update-user-car.dto'
import { Roles } from 'src/lib/roles'

@Controller('/user_car')
@Injectable()
export class UserCarController {
  constructor(private userCarService: UserCarService) {}
  @Get()
  @Roles(['admin', 'client', 'store'])
  async getAll(
    @Request() request,
    @Query()
    query: GetUserCarDto,
  ) {
    if (request.user.website === 'client') {
      const result = await this.userCarService.getUserCar({
        userId: request.user.id,
      })
      return result
    }
    const result = await this.userCarService.getAll(query)
    return result
  }
  @Post()
  @Roles(['admin', 'client', 'store'])
  async addUserCar(
    @Request() request,
    @Body()
    body: CreateUserCarDto,
  ) {
    if (request.user.website === 'client') {
      body.userId = request.user.id
    }
    const result = await this.userCarService.addUserCar(body)
    return Response.Success(result)
  }
  @Put('/:id')
  async editUserCar(
    @Request() request,
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: UpdateUserCarDto,
  ) {
    if (request.user.website === 'client') {
      const result = await this.userCarService.getUserCar({
        userId: request.user.id,
      })
      if (!result) {
        throw Error('找不到此记录')
      }
    }
    const result = await this.userCarService.editOneByUserId(body, id)
    return Response.Success(result)
  }
  @Delete('/:id')
  async deleteUserCarOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() request,
  ) {
    if (request.user.website === 'client') {
      const result = await this.userCarService.getUserCar({
        userId: request.user.id,
      })
      if (!result) {
        throw Error('找不到此记录')
      }
    }
    await this.userCarService.deleteOneByUserId(id)
    return Response.Success()
  }
}
