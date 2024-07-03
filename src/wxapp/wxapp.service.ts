import { GetQrcode } from '@controller/dto/get-qrcode.dto'
import {
  OnModuleInit,
  OnModuleDestroy,
  Inject,
  CACHE_MANAGER,
  Injectable,
} from '@nestjs/common'
import { Cache } from 'cache-manager'
@Injectable()
export class WxappService implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  private baseUrl = `https://api.weixin.qq.com`

  async getOpenId(jsCode: string): Promise<string> {
    const params = new URLSearchParams()
    params.append('grant_type', 'authorization_code')
    params.append('appid', process.env.wxAppId)
    params.append('secret', process.env.wxSecret)
    params.append('js_code', jsCode)
    const result: { openid: string } = await fetch(
      `${this.baseUrl}/sns/jscode2session?${params.toString()}`,
      { method: 'GET' },
    )
      .then(res => res.json())
      .then(res => {
        if (res.errcode) {
          throw Error(res.errmsg)
        }
        return res
      })
      .catch(err => {
        throw err
      })
    return result.openid
  }

  async getQRcode({ scene, width, env_version, page, is_hyaline }: GetQrcode) {
    const token = await this.getToken()
    const result = await fetch(
      `${this.baseUrl}/wxa/getwxacodeunlimit?access_token=${token}`,
      {
        method: 'POST',
        body: JSON.stringify({
          scene,
          width,
          env_version,
          page,
          check_path: false,
          is_hyaline,
        }),
      },
    ).then(async res => {
      if (res.headers.get('Content-Type').includes('application/json')) {
        throw Error(JSON.stringify(await res.json()))
      }
      return res.arrayBuffer()
    })
    return result
  }

  async getToken() {
    const params = new URLSearchParams()
    params.append('grant_type', 'client_credential')
    params.append('appid', process.env.wxAppId)
    params.append('secret', process.env.wxSecret)
    const cacheToken: string | undefined = await this.cacheManager.get(
      process.env.appEnv + 'token',
    )
    if (cacheToken) {
      return cacheToken
    }
    const result = await fetch(
      `https://api.weixin.qq.com/cgi-bin/token?${params.toString()}`,
    )
      .then(res => res.json())
      .catch(err => {
        throw err
      })
    if (result.expires_in) {
      this.cacheManager.set(
        process.env.appEnv + 'token',
        result?.access_token,
        {
          ttl: 300,
        },
      )
    }
    return result?.access_token
  }

  async onModuleInit() {
    await this.getToken()
  }

  onModuleDestroy() {
    console.log('Module destroyed...')
  }

  async createQRCode() {
    const token = await this.getToken()
    const result = await fetch(
      `https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${token}`,
      {
        method: 'POST',
        body: JSON.stringify({
          path: 'pages/admin/configModel/configModel',
          width: 300,
        }),
      },
    ).then(res => res.json())
    return result
  }

  async sendMessage({
    template_id,
    touser,
    data,
    page,
    lang = 'zh_CN',
  }: {
    template_id: string
    touser: string
    data: Object
    page: string
    lang?: string
  }) {
    const token = await this.getToken()
    await fetch(
      `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${token}`,
      {
        method: 'POST',
        body: JSON.stringify({
          template_id,
          touser,
          data,
          page,
          miniprogram_state: process.env.appEnv as
            | 'trial'
            | 'formal'
            | 'developer',
          lang,
        }),
      },
    )
      .then(res => res.json())

      .then(async result_message => {
        const { errcode } = result_message
        if ([42001, 40001].includes(errcode)) {
          this.cacheManager.del(process.env.appEnv + 'token')
          return this.sendMessage({
            template_id,
            touser,
            data,
            page,
            lang,
          })
        }
        if (errcode === 40014) {
          await this.getToken()
          return this.sendMessage({
            template_id,
            page,
            touser,
            data,
          })
        } else {
          return result_message
        }
      })
      .catch(err => {
        throw err
      })
  }

  async getPhoneNumber(code: string) {
    const token = await this.getToken()
    try {
      const result: {
        errcode: number
        errmsg: string
        phone_info: {
          phoneNumber: string
          purePhoneNumber: string
          countryCode: number
          watermark: {
            timestamp: number
            appid: string
          }
        }
      } = await fetch(
        `${this.baseUrl}/wxa/business/getuserphonenumber?access_token=${token}`,
        { method: 'post', body: JSON.stringify({ code }) },
      ).then(res => res.json())
      if ([42001, 40001].includes(result.errcode)) {
        this.cacheManager.del(process.env.appEnv + 'token')
        return this.getPhoneNumber(code)
      }
      return result
    } catch (err) {
      this.cacheManager.del(process.env.appEnv + 'token')
      throw err
    }
  }
}
