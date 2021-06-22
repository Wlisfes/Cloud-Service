import { Controller, Post, Get, Body, Query } from '@nestjs/common'
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
	@ApiResponse({ status: 200, description: 'OK', type: DTO.AliyunCreateUploadResponse })
	@Post('create/upload')
	async createUpload(@Body() props: DTO.CreateUpload): Promise<DTO.AliyunCreateUploadResponse> {
		return await this.aliyunService.createUpload(props)
	}

	@ApiOperation({ summary: '刷新上传凭证' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.AliyunRefreshUploadResponse })
	@Post('refresh/upload')
	async refreshUpload(@Body() props: DTO.RefreshUpload): Promise<DTO.AliyunRefreshUploadResponse> {
		return await this.aliyunService.refreshUpload(props)
	}

	@ApiOperation({ summary: '获取播放凭证' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.AliyunCreatePlayAuthResponse })
	@Get('play/auth')
	async createPlayAuth(@Query() props: DTO.CreatePlayAuth): Promise<DTO.AliyunCreatePlayAuthResponse> {
		return await this.aliyunService.createPlayAuth(props)
	}

	@ApiOperation({ summary: '获取播放信息' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.AliyunCreatePlayInfoResponse })
	@Get('play/info')
	async createPlayInfo(@Query() props: DTO.CreatePlayInfo): Promise<DTO.AliyunCreatePlayInfoResponse> {
		return await this.aliyunService.createPlayInfo(props)
	}
}
