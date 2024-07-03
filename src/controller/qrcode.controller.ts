import { Controller, Get, Query, Request } from '@nestjs/common'
import { WxappService } from 'src/wxapp/wxapp.service'
import OSS from 'src/lib/alicos'
import { Response } from 'src/lib/response'
import { MD5 } from 'src/lib/util'
import QRCode from 'qrcode'
import { Roles } from 'src/lib/roles'
import { GetQrcode, ToImageDTO } from './dto/get-qrcode.dto'
@Controller('/qrcode')
export class QRcodeController {
  constructor(private wxAppService: WxappService) {}

  @Get('/toImage')
  @Roles(['client'])
  async toImage(@Query() query: ToImageDTO) {
    try {
      const url = await QRCode.toDataURL(query.code, {
        errorCorrectionLevel: 'H',
        width: query.width || 400,
        margin: 0,
      })
      return Response.Success({ url })
    } catch (err) {
      return Response.Fail({ err })
    }
  }

  @Get()
  @Roles(['client'])
  async getQRcode(
    @Request() request,
    @Query()
    { scene, width, env_version, page, is_hyaline }: GetQrcode,
  ) {
    const store = await OSS()
    const urlName =
      MD5(`${request.user.id}${scene + width + env_version + page}`) +
      (!is_hyaline ? '.jpg' : '.png')

    let url
    try {
      const result = await store.head(urlName)
      if (!result.res.size) {
        throw { code: 'NoSuchKey' }
      }
      url = result.res['requestUrls'][0]
    } catch (error) {
      if (error.code === 'NoSuchKey') {
        const fileBuffer = await this.wxAppService.getQRcode({
          scene,
          width,
          env_version,
          page,
          is_hyaline,
        })
        url = (await store.put(urlName, Buffer.from(fileBuffer))).url
      }
    }
    return { url }
  }
}
