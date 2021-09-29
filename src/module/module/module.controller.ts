import { Controller, Post, Get, Put, Delete, Body, Query, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { ModuleService } from './module.service'
import { AuthToken, AuthRole, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './module.interface'

@ApiTags('系统管理-模块权限管理')
@Controller('module')
export class ModuleController {
	constructor(private readonly moduleService: ModuleService) {}

	@ApiOperation({ summary: '创建模块权限-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev'], module: 'module', action: 'create' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCreateModuleResponse })
	@Post('create')
	async nodeCreateModule(@Body() body: DTO.NodeCreateModuleParameter) {
		return await this.moduleService.nodeCreateModule(body)
	}

	@ApiOperation({ summary: '修改模块权限-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev'], module: 'module', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeUpdateModuleResponse })
	@Put('update')
	async nodeUpdateModule(@Body() body: DTO.NodeUpdateModuleParameter) {
		return await this.moduleService.nodeUpdateModule(body)
	}

	@ApiOperation({ summary: '模块列表-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'visitor', 'dev'], module: 'module', action: 'list' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK' })
	@Get('list-node')
	async nodeModules() {
		return await this.moduleService.nodeModules()
	}

	@ApiOperation({ summary: '模块信息-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'visitor', 'dev'], module: 'module', action: 'params' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeModuleResponse })
	@Get('info')
	async nodeModule(@Query() query: DTO.NodeModuleParameter) {
		return await this.moduleService.nodeModule(query)
	}

	@ApiOperation({ summary: '创建接口权限-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev'], module: 'module', action: 'create' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCreateModuleActionResponse })
	@Post('create-action')
	async nodeCreateModuleAction(@Body() body: DTO.NodeCreateModuleActionParameter) {
		return await this.moduleService.nodeCreateModuleAction(body)
	}

	@ApiOperation({ summary: '修改接口权限-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev'], module: 'module', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeUpdateModuleActionResponse })
	@Put('update-action')
	async nodeUpdateModuleAction(@Body() body: DTO.NodeUpdateModuleActionParameter) {
		return await this.moduleService.nodeUpdateModuleAction(body)
	}

	@ApiOperation({ summary: '接口权限列表-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'visitor', 'dev'], module: 'module', action: 'list' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK' })
	@Get('action/list-node')
	async nodeModuleActions() {
		return await this.moduleService.nodeModuleActions()
	}

	@ApiOperation({ summary: '接口权限信息-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'visitor', 'dev'], module: 'module', action: 'params' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeModuleActionResponse })
	@Get('action/info')
	async nodeModuleAction(@Query() query: DTO.NodeModuleActionParameter) {
		return await this.moduleService.nodeModuleAction(query)
	}
}
