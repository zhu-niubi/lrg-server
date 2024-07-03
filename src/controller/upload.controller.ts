import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'src/lib/response'
import OSS from 'src/lib/alicos'
import crypto from 'crypto'
import path from 'path'
import { PutObjectResult } from 'ali-oss'
import { Public } from '@lib/util'
@Controller('/upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const result = await this.put(file)
    return Response.Success({ name: result.name, url: result.url })
  }

  async put(file: Express.Multer.File): Promise<PutObjectResult> {
    const fileName = crypto
      .createHash('md5')
      .update(`${file.originalname}${new Date().getTime()}`)
      .digest('hex')
    return await OSS().put(
      `${fileName}${path.extname(file.originalname)}`,
      file.buffer,
    )
  }
}
