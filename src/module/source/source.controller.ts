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
	@AuthRole({ role: ['admin', 'super'], module: 'source', action: 'create' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCreateSourceResponse })
	@Post('create')
	async nodeCreateSource(@Body() body: DTO.NodeCreateSourceParameter) {
		return await this.sourceService.nodeCreateSource(body)
	}

	@ApiOperation({ summary: '修改标签' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super'], module: 'source', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeUpdateSourceResponse })
	@Put('update')
	async nodeUpdateSource(@Body() body: DTO.NodeUpdateSourceParameter) {
		return await this.sourceService.nodeUpdateSource(body)
	}

	@ApiOperation({ summary: '切换标签状态' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super'], module: 'source', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeSourceCutoverResponse })
	@Put('cutover')
	async nodeSourceCutover(@Body() body: DTO.NodeSourceCutoverParameter) {
		return await this.sourceService.nodeSourceCutover(body)
	}

	@ApiOperation({ summary: '标签信息' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeSourceResponse })
	@Get('info')
	async nodeSource(@Query() query: DTO.NodeSourceParameter) {
		return await this.sourceService.nodeSource(query)
	}

	@ApiOperation({ summary: '标签列表' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeSourcesResponse })
	@Get('list-node')
	async nodeSources(@Query() query: DTO.NodeSourcesParameter) {
		return await this.sourceService.nodeSources(query)
	}

	@ApiOperation({ summary: '删除标签' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin'], module: 'source', action: 'delete' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeDeleteSourceResponse })
	@Delete('del')
	async nodeDeleteSource(@Query() query: DTO.NodeDeleteSourceParameter) {
		return await this.sourceService.nodeDeleteSource(query)
	}
}
