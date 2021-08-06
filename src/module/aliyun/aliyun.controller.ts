import { Controller, Post, Get, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiProduces, ApiBearerAuth } from '@nestjs/swagger'
import { AliyunService } from './aliyun.service'
import { AuthToken, AuthRole, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './aliyun.interface'

@ApiTags('阿里云视频点播模块')
@Controller('aliyun')
export class AliyunController {
	constructor(private readonly aliyunService: AliyunService) {}

	@ApiOperation({ summary: '创建上传凭证' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super'], module: 'cloud', action: 'create' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCreateResponse })
	@Post('node-create')
	async nodeCreate(@Body() props: DTO.NodeCreateParameter) {
		return await this.aliyunService.nodeCreate(props)
	}

	@ApiOperation({ summary: '刷新上传凭证' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super'], module: 'cloud', action: 'create' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeRefreshResponse })
	@Post('node-refresh')
	async nodeRefresh(@Body() props: DTO.NodeRefreshParameter) {
		return await this.aliyunService.nodeRefresh(props)
	}

	@ApiOperation({ summary: '获取转码模板列表' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeTransferResponse })
	@Get('node-transfer')
	async nodeTransfer() {
		return await this.aliyunService.nodeTransfer()
	}

	@ApiOperation({ summary: '获取分类列表' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeSourceResponse })
	@Get('node-source')
	async nodeSource(@Query() props: DTO.NodeSourceParameter) {
		return await this.aliyunService.nodeSource(props)
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
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeOssStsResponse })
	@Post('node-oss-sts')
	async nodeOssSts() {
		return await this.aliyunService.nodeOssSts()
	}
}
