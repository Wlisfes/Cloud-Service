import { Controller, Post, Get, Put, Delete, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { CloudSourceService } from './cloud-source.service'
import { AuthToken, AuthRole, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './cloud-source.interface'

@ApiTags('云点播管理-音视频分类模块')
@Controller('cloud-source')
export class CloudSourceController {
	constructor(private readonly cloudSourceService: CloudSourceService) {}

	@ApiOperation({ summary: '创建分类标签' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'cloud', action: 'create' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCreateCloudSourceResponse })
	@Post('create')
	async nodeCreateCloudSource(@Body() body: DTO.NodeCreateCloudSourceParameter) {
		return await this.cloudSourceService.nodeCreateCloudSource(body)
	}

	@ApiOperation({ summary: '修改分类标签' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'cloud', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeUpdateCloudSourceResponse })
	@Put('update')
	async nodeUpdateCloudSource(@Body() body: DTO.NodeUpdateCloudSourceParameter) {
		return await this.cloudSourceService.nodeUpdateCloudSource(body)
	}

	@ApiOperation({ summary: '切换分类标签状态' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'cloud', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCloudSourceCutoverResponse })
	@Put('cutover')
	async nodeCloudSourceCutover(@Body() body: DTO.NodeCloudSourceCutoverParameter) {
		return await this.cloudSourceService.nodeCloudSourceCutover(body)
	}

	@ApiOperation({ summary: '分类标签信息' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCloudSourceResponse })
	@Get('info')
	async nodeCloudSource(@Query() query: DTO.NodeCloudSourceParameter) {
		return await this.cloudSourceService.nodeCloudSource(query)
	}

	@ApiOperation({ summary: '分类标签列表' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCloudSourcesResponse })
	@Get('list-node')
	async nodeCloudSources(@Query() query: DTO.NodeCloudSourcesParameter) {
		return await this.cloudSourceService.nodeCloudSources(query)
	}

	@ApiOperation({ summary: '删除分类标签' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev'], module: 'cloud', action: 'delete' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeDeleteCloudSourceResponse })
	@Delete('del')
	async nodeDeleteCloudSource(@Query() query: DTO.NodeDeleteCloudSourceParameter) {
		return await this.cloudSourceService.nodeDeleteCloudSource(query)
	}
}
