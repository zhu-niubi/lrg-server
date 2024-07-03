import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Request,
} from '@nestjs/common'
import { UserProductPackService } from './user-product-pack.service'
import { CreateUserProductPackDto } from './dto/create-user-product-pack.dto'
import { GetUserProductPackDto } from './dto/get-user-product-pack.dto'

@Controller('user-product-pack')
export class UserProductPackController {
  constructor(
    private readonly userProductPackService: UserProductPackService,
  ) {}

  @Post()
  create(@Body() createUserProductPackDto: CreateUserProductPackDto) {
    return this.userProductPackService.create(createUserProductPackDto)
  }

  @Get()
  findAll(
    @Request() request,
    @Query() getUserProductPackDto: GetUserProductPackDto,
  ) {
    if (request.user.website === 'client') {
      getUserProductPackDto.userId = request.user.id
    }
    return this.userProductPackService.findAll(getUserProductPackDto)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userProductPackService.findOne(+id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userProductPackService.remove(+id)
  }
}
