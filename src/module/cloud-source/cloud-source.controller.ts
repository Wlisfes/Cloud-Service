import { Controller, Post, Get, Put, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { CloudSourceService } from './cloud-source.service'
import { AuthToken, AuthRole, APP_AUTH_TOKEN } from '@/guard/auth.guard'

@ApiTags('云点播管理-音视频分类模块')
@Controller('cloud-source')
export class CloudSourceController {
	constructor(private readonly cloudSourceService: CloudSourceService) {}

	@ApiOperation({ summary: '创建分类标签' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	// @AuthRole({ role: ['admin', 'super'], module: 'cloud-source', action: 'create' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK' })
	@Post('create')
	async nodeCreateCloudSource(@Body() body) {}
}
