import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  ParseIntPipe,
  Query,
  Request,
  Post,
  Injectable,
} from '@nestjs/common'
import { Response } from 'src/lib/response'
import { phoneCheck } from 'src/lib/testing'
import { UserService } from './user.service'
import { Roles } from 'src/lib/roles'
import { GetUserDTO } from './dto/get-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { user } from '@prisma/client'
import { BindOpenIdDTO } from './dto/bind-openId.dto'
import { AuthService } from 'src/auth/auth.service'
import { WxappService } from 'src/wxapp/wxapp.service'

@Controller('/user')
@Injectable()
export class UserController {
  constructor(
    private userService: UserService,
    private wxAppService: WxappService,
    private authService: AuthService,
  ) {}
  @Get()
  @Roles(['admin', 'store', 'client'])
  async findAll(
    @Request() request,
    @Query()
    query: GetUserDTO,
  ) {
    if (request.user.website === 'client') {
      const result = await this.userService.findOneUser({
        id: request.user.id,
      })
      result.phoneNumber = phoneCheck('+86', result.phoneNumber)
        ? result.phoneNumber.slice(0, 3) + '****' + result.phoneNumber.slice(-4)
        : result.phoneNumber
      return result
    }
    const result = await this.userService.findManyUser(query)
    result.list.forEach((i: user) => {
      i.phoneNumber = i.phoneNumber
        ? i.phoneNumber.slice(0, 3) + '****' + i.phoneNumber.slice(-4)
        : i.phoneNumber
    })
    if (query.phoneNumber) {
      const validate = phoneCheck('+86', query.phoneNumber)
      if (!validate) {
        return Response.Fail('手机号格式不正确')
      }
    }
    return Response.Success(result)
  }
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(+id)
  }
  @Put('/:id')
  @Roles(['admin', 'store', 'client'])
  async editOne(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    user: UpdateUserDto,
  ) {
    const validate = phoneCheck('+86', user.phoneNumber)
    if (user.phoneNumber && !validate) {
      return Response.Fail('手机号格式不正确')
    }
    const res = await this.userService.updateUser(user, id)
    return Response.Success(res)
  }
  @Post('/bindPhoneNumber')
  @Roles(['client'])
  async bindPhoneNumber(
    @Request() request,
    @Body() { code }: { code: string },
  ) {
    if (!code) {
      throw Error('Bad request')
    }
    const res = await this.wxAppService.getPhoneNumber(code)
    if (res.errcode === 0) {
      const result = await this.userService.mergeUserByPhoneNumber(
        res.phone_info.purePhoneNumber,
        request.user.id,
        {},
      )
      if (result.merge) {
        return Response.Fail('该手机号已注册，账户已合并', 100)
      } else {
        return result
      }
    } else {
      throw Error('手机号获取失败')
    }
  }
  @Put()
  @Roles(['client'])
  async editClientUser(@Request() request, @Body() user: UpdateUserDto) {
    await this.userService.updateUser(user, request.user.id)
  }
  @Post('/bind_openId')
  @Roles(['client'])
  async bindOpenId(
    @Request() request,
    @Body() { jsCode, nickname, avatarUrl }: BindOpenIdDTO,
  ) {
    const openId = await this.wxAppService.getOpenId(jsCode)
    const result = await this.userService.mergeUser(openId, request.user.id, {
      nickname,
      avatarUrl,
    })
    if (result.merge) {
      let resultJson = {
        token: this.authService.sign({ id: result.id, website: 'client' })
          .token,
        merge: result.merge,
      }
      return resultJson
    } else {
      return result
    }
  }
}
