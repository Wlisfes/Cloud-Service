import { Controller, Post, Get, Put, Delete, Body, Query, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { CloudService } from './cloud.service'
import { AuthToken, AuthRole, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './cloud.interface'

@ApiTags('云点播管理-音视频模块')
@Controller('cloud')
export class CloudController {
	constructor(private readonly cloudService: CloudService) {}

	@ApiOperation({ summary: '创建音视频' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super'], module: 'cloud', action: 'create' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCreateCloudResponse })
	@Post('create')
	async nodeCreateCloud(@Body() body: DTO.NodeCreateCloudParameter, @Req() req: { user: { uid: number } }) {
		return await this.cloudService.nodeCreateCloud(body, req.user.uid)
	}

	@ApiOperation({ summary: '修改音视频媒体' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super'], module: 'cloud', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeUpdateCloudResponse })
	@Put('update')
	async nodeUpdateCloud(@Body() body: DTO.NodeUpdateCloudParameter) {
		return await this.cloudService.nodeUpdateCloud(body)
	}

	@ApiOperation({ summary: '切换音视频媒体状态' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super'], module: 'cloud', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCloudCutoverResponse })
	@Put('cutover')
	async nodeCloudCutover(@Body() body: DTO.NodeCloudCutoverParameter) {
		return await this.cloudService.nodeCloudCutover(body)
	}

	@ApiOperation({ summary: '音视频信息' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCloudResponse })
	@Get('info')
	async nodeCloud(@Query() query: DTO.NodeCloudParameter) {
		return await this.cloudService.nodeCloud(query)
	}

	@ApiOperation({ summary: '音视频列表' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCloudsResponse })
	@Get('list-node')
	async nodeClouds(@Query() query: DTO.NodeCloudsParameter) {
		return await this.cloudService.nodeClouds(query)
	}

	@ApiOperation({ summary: '多集媒体目录列表' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeMultipleCloudsResponse })
	@Get('list-multiple')
	async nodeMultipleClouds(@Query() query: DTO.NodeMultipleCloudsParameter) {
		return await this.cloudService.nodeMultipleClouds(query)
	}

	@ApiOperation({ summary: '删除音视频媒体' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super'], module: 'cloud', action: 'delete' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeDeleteCloudResponse })
	@Delete('del')
	async nodeDeleteCloud(@Query() query: DTO.NodeDeleteCloudParameter) {
		return await this.cloudService.nodeDeleteCloud(query)
	}
}
