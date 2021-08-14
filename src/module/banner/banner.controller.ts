import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse } from '@nestjs/swagger'
import { BannerService } from './banner.service'
import * as DTO from './banner.interface'

@ApiTags('Banner模块')
@Controller('banner')
export class BannerController {
	constructor(private readonly bannerService: BannerService) {}

	@ApiOperation({ summary: '获取近一周bing壁纸' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeBannerResponse })
	@Get()
	async nodeBanner() {
		return await this.bannerService.nodeBanner()
	}
}
