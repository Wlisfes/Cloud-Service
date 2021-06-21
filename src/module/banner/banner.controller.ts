import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger'
import { BannerService } from './banner.service'

@ApiTags('Banner模块')
@Controller('banner')
export class BannerController {
	constructor(private readonly bannerService: BannerService) {}

	@ApiOperation({ summary: '获取近一周bing壁纸' })
	@Get('/bing')
	async getBannerBing() {
		return await this.bannerService.getBannerBing()
	}
}
