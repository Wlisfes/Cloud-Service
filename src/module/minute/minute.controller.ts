import { Controller, Post, Get, Put, Delete, Body, Query, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { MinuteService } from './minute.service'
import { AuthToken, AuthRole, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './minute.interface'

@ApiTags('归档管理-收录模块')
@Controller('minute')
export class MinuteController {
	constructor(private readonly minuteService: MinuteService) {}

	@ApiOperation({ summary: '创建收录-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'minute', action: 'create' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCreateMinuteResponse })
	@Post('create')
	async nodeCreateMinute(@Body() body: DTO.NodeCreateMinuteParameter, @Req() req: { user: { uid: number } }) {
		return await this.minuteService.nodeCreateMinute(body, req.user.uid)
	}

	@ApiOperation({ summary: '修改收录-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'minute', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeUpdateMinuteResponse })
	@Put('update')
	async nodeUpdateMinute(@Body() body: DTO.NodeUpdateMinuteParameter, @Req() req: { user: { uid: number } }) {
		return await this.minuteService.nodeUpdateMinute(body, req.user.uid)
	}

	@ApiOperation({ summary: '切换收录状态-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'minute', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeMinuteCutoverResponse })
	@Put('cutover')
	async nodeMinuteCutover(@Body() body: DTO.NodeMinuteCutoverParameter, @Req() req: { user: { uid: number } }) {
		return await this.minuteService.nodeMinuteCutover(body)
	}

	@ApiOperation({ summary: '收录信息-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'minute', action: 'params' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeMinuteResponse })
	@Get('info')
	async nodeMinute(@Query() query: DTO.NodeMinuteParameter, @Req() req: { user: { uid: number } }) {
		return await this.minuteService.nodeMinute(query)
	}

	@ApiOperation({ summary: '收录列表-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'minute', action: 'params' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeMinutesResponse })
	@Get('list-node')
	async nodeMinutes(@Query() query: DTO.NodeMinutesParameter, @Req() req: { user: { uid: number } }) {
		return await this.minuteService.nodeMinutes(query, req.user.uid)
	}

	@ApiOperation({ summary: '收录信息-客户端' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeMinuteResponse })
	@Get('client/info')
	async nodeClientMinute(@Query() query: DTO.NodeMinuteParameter) {
		return await this.minuteService.nodeClientMinute(query)
	}

	@ApiOperation({ summary: '收录列表-客户端' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeMinutesResponse })
	@Get('client/list-node')
	async nodeClientMinutes(@Query() query: DTO.NodeClientMinutesParameter) {
		return await this.minuteService.nodeClientMinutes(query)
	}

	@ApiOperation({ summary: '删除收录-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'minute', action: 'delete' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeDeleteMinuteResponse })
	@Delete('del')
	async nodeDeleteMinute(@Query() query: DTO.NodeDeleteMinuteParameter) {
		return await this.minuteService.nodeDeleteMinute(query)
	}
}
