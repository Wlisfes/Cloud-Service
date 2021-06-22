import { Controller, Post, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiProduces } from '@nestjs/swagger'
import { AliyunService } from './aliyun.service'
import * as DTO from './aliyun.interface'

@ApiTags('阿里云模块')
@Controller('aliyun')
export class AliyunController {
	constructor(private readonly aliyunService: AliyunService) {}

	@ApiOperation({ summary: '创建上传凭证' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.AliyunInterface })
	@Post('create/upload')
	async createUpload(@Body() props: DTO.CreateUpload) {
		return await this.aliyunService.createUpload(props)
	}

	@ApiOperation({ summary: '刷新上传凭证' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.AliyunInterface })
	@Post('refresh/upload')
	async refreshUpload(@Body() props: DTO.RefreshUpload) {
		return await this.aliyunService.refreshUpload(props)
	}
}
