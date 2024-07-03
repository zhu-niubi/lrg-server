import { Body, Controller, Get, Post } from '@nestjs/common'
import { Response } from 'src/lib/response'
import { WxappService } from 'src/wxapp/wxapp.service'
import { RecommendService } from 'src/recommend/recommend.service'
import { UserService } from 'src/user/user.service'
import { AdminLogin, ClientLogin, ClientPhoneLogin } from './dto/login.dto'
import { AuthService } from 'src/auth/auth.service'
import { Public } from 'src/lib/util'

@Controller()
export class AppController {
  constructor(
    private wxAppService: WxappService,
    private recommendService: RecommendService,
    private authService: AuthService,
    private userService: UserService,
  ) {}
  @Post('/login')
  @Public()
  async login(@Body() loginData: AdminLogin) {
    const result = await this.authService.validataAdmin({
      ...loginData,
      website: 'admin',
    })
    return result
  }
  @Post('/login/store')
  @Public()
  async loginStore(@Body() loginData: AdminLogin) {
    const result = await this.authService.validataAdmin({
      ...loginData,
      website: 'store',
    })
    return result
  }
  @Post('/login/client')
  @Public()
  async loginClient(
    @Body()
    loginData: ClientLogin,
  ) {
    const openId = await this.wxAppService.getOpenId(loginData.jsCode)
    if (!openId) {
      return Response.Fail('jsCode is not allow')
    }
    const result = await this.userService.login({
      openId,
      nickname: loginData.nickname || '',
    })
    if (result.newUser && loginData.recommenderId) {
      if (result.id === loginData.recommenderId) {
        throw new Error('被推荐人不能为本人')
      }
      await this.recommendService.addOne({
        recommenderId: loginData.recommenderId,
        userId: result.id,
        usedCoupon: 0,
      })
    }
    return this.authService.sign({ id: result.id, website: 'client' })
  }
  @Get('/login/phoneNumber')
  @Public()
  get() {
    console.log(this.authService.sign({ id: 1, website: 'admin' }))
  }
  @Post('/login/phoneNumber')
  @Public()
  async loginClientPhone(
    @Body()
    { code, recommenderId }: ClientPhoneLogin,
  ) {
    const res = await this.wxAppService.getPhoneNumber(code)
    if (res.errcode === 0) {
      const result = await this.userService.createUserByPhoneNmber(
        res.phone_info.phoneNumber,
      )
      if (result.newUser && recommenderId) {
        if (result.id === recommenderId) {
          throw new Error('被推荐人不能为本人')
        }
        await this.recommendService.addOne({
          recommenderId: recommenderId,
          userId: result.id,
          usedCoupon: 0,
        })
      }
      return this.authService.sign({ id: result.id, website: 'client' })
    } else {
      throw Error(res.errmsg)
    }
    // const openId = await this.wxAppService.getOpenId(loginData.jsCode)
    // if (!openId) {
    //   return Response.Fail('jsCode is not allow')
    // }
    // const result = await this.userService.login({
    //   openId,
    //   nickname: loginData.nickname || '',
    // })
  }
}
