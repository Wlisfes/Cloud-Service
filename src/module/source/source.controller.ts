import { Controller, Post, Get, Put, Delete, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { SourceService } from './source.service'
import { AuthToken, AuthRole, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './source.interface'

@ApiTags('归档管理-标签模块')
@Controller('source')
export class SourceController {
	constructor(private readonly sourceService: SourceService) {}

	@ApiOperation({ summary: '创建标签' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super'], module: 'cloud', action: 'create' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCreateSourceResponse })
	@Post('create')
	async nodeCreateSource(@Body() body: DTO.NodeCreateSourceParameter) {
		return await this.sourceService.nodeCreateSource(body)
	}
}
