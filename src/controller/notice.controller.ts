import { Body, Controller, Get, Post } from '@nestjs/common'
import fs from 'fs'
import { Roles } from 'src/lib/roles'
import { Public } from 'src/lib/util'
@Controller('/notice')
export class NoticeController {
  @Get()
  @Public()
  async uploadFile() {
    return fs.readFileSync('./notice.txt', { encoding: 'utf-8' })
  }

  @Post()
  @Roles(['admin', 'store'])
  async add(@Body() body: { data: string }) {
    await fs.writeFileSync('./notice.txt', body.data)
    return null
  }
}
