import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AliyunService } from './aliyun.service'
import * as DTO from './aliyun.dto'

@ApiTags('阿里云模块')
@Controller('aliyun')
export class AliyunController {
	constructor(private readonly aliyunService: AliyunService) {}

	@ApiOperation({ summary: '创建上传凭证' })
	@Get('create/upload')
	async createUpload(@Query() query: DTO.CreateUpload) {
		return await this.aliyunService.createUpload(query)
	}

	@ApiOperation({ summary: '刷新上传凭证' })
	@Get('refresh/upload')
	async refreshUpload(@Query() query: DTO.RefreshUpload) {
		return await this.aliyunService.refreshUpload(query)
	}
}
