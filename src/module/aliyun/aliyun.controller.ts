import { Controller, Post, Get, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiProduces, ApiBearerAuth } from '@nestjs/swagger'
import { AliyunService } from './aliyun.service'
import { AuthToken, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './aliyun.interface'

@ApiTags('阿里云视频点播模块')
@Controller('aliyun')
export class AliyunController {
	constructor(private readonly aliyunService: AliyunService) {}

	@ApiOperation({ summary: '创建上传凭证' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.AliyunCreateUploadResponse })
	@Post('create-upload')
	async createUpload(@Body() props: DTO.CreateUpload) {
		return await this.aliyunService.createUpload(props)
	}

	@ApiOperation({ summary: '刷新上传凭证' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.AliyunRefreshUploadResponse })
	@Post('refresh-upload')
	async refreshUpload(@Body() props: DTO.RefreshUpload) {
		return await this.aliyunService.refreshUpload(props)
	}

	@ApiOperation({ summary: '获取转码模板列表' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.TransferTmplateResponse })
	@Get('transfer-list')
	async transferTmplate() {
		return await this.aliyunService.transferTmplate()
	}

	@ApiOperation({ summary: '获取分类列表' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.AssetsSourceResponse })
	@Get('source-list')
	async assetsSource(@Query() props: DTO.AssetsSource) {
		return await this.aliyunService.assetsSource(props)
	}

	@ApiOperation({ summary: '获取播放凭证' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.AliyunCreatePlayAuthResponse })
	@Get('play-auth')
	async createPlayAuth(@Query() props: DTO.CreatePlayAuth) {
		return await this.aliyunService.createPlayAuth(props)
	}

	@ApiOperation({ summary: '获取播放信息' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.AliyunCreatePlayInfoResponse })
	@Get('play-info')
	async createPlayInfo(@Query() props: DTO.CreatePlayInfo) {
		return await this.aliyunService.createPlayInfo(props)
	}

	@ApiOperation({ summary: '创建Oss-STS授权' })
	// @ApiBearerAuth(APP_AUTH_TOKEN)
	// @AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.CreateOssStsResponse })
	@Get('oss-sts')
	async createOssSts() {
		return await this.aliyunService.createOssSts()
	}
}
