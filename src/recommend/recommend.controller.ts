import { Controller, Get, Query, Request, Injectable } from '@nestjs/common'
import { Roles } from 'src/lib/roles'
import { GetRecommendDto } from './dto/get-recommend.dto'
import { RecommendService } from './recommend.service'

@Controller('/recommend')
@Injectable()
export class RecommendController {
  constructor(private recommendService: RecommendService) {}

  @Get()
  @Roles(['admin', 'client', 'store'])
  async getAll(
    @Request() request,
    @Query()
    query: GetRecommendDto,
  ) {
    let totalSuccess = 0
    if (request.user.website === 'client') {
      query.recommenderId = request.user.id
      totalSuccess = await this.recommendService.getSuccessCount(
        request.user.id,
      )
    }
    const result = await this.recommendService.getAll(query)

    return { ...result, totalSuccess }
  }
}
