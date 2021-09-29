import { Controller, Get, Put, Delete, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { LoggerService } from './logger.service'
import { AuthToken, AuthRole, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './logger.interface'

@ApiTags('系统管理-Logger模块')
@Controller('logger')
export class LoggerController {
	constructor(private readonly loggerService: LoggerService) {}

	@ApiOperation({ summary: '切换Logger状态-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev'], module: 'logger', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeLoggerCutoverResponse })
	@Put('cutover')
	async nodeLoggerCutover(@Body() body: DTO.NodeLoggerCutoverParameter) {
		return await this.loggerService.nodeLoggerCutover(body)
	}

	@ApiOperation({ summary: 'Logger信息-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev', 'visitor'], module: 'logger', action: 'params' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeLoggerResponse })
	@Get('info')
	async nodeLogger(@Query() query: DTO.NodeLoggerParameter) {
		return await this.loggerService.nodeLogger(query)
	}

	@ApiOperation({ summary: 'Logger列表-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev', 'visitor'], module: 'logger', action: 'list' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeLoggersResponse })
	@Get('list-node')
	async nodeLoggers(@Query() query: DTO.NodeLoggersParameter) {
		return await this.loggerService.nodeLoggers(query)
	}

	@ApiOperation({ summary: '删除Logger-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev'], module: 'logger', action: 'delete' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeDeleteLoggerResponse })
	@Delete('del')
	async nodeDeleteLogger(@Query() query: DTO.NodeDeleteLoggerParameter) {
		return await this.loggerService.nodeDeleteLogger(query)
	}
}
