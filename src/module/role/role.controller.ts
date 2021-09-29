import { Controller, Get, Post, Put, Body, Query, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { RoleService } from './role.service'
import { AuthToken, AuthRole, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './role.interface'

@ApiTags('系统管理-角色模块')
@Controller('role')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@ApiOperation({ summary: '创建角色-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev'], module: 'role', action: 'create' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCreateRoleResponse })
	@Post('create')
	async nodeCreateRole(@Body() body: DTO.NodeCreateRoleParameter) {
		return await this.roleService.nodeCreateRole(body)
	}

	@ApiOperation({ summary: '修改角色-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev'], module: 'role', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeUpdateRoleResponse })
	@Put('update')
	async nodeUpdateRole(@Body() body: DTO.NodeUpdateRoleParameter) {
		return await this.roleService.nodeUpdateRole(body)
	}

	@ApiOperation({ summary: '切换角色状态-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev'], module: 'role', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeRoleCutoverResponse })
	@Put('cutover')
	async nodeRoleCutover(@Body() body: DTO.NodeRoleCutoverParameter) {
		return await this.roleService.nodeRoleCutover(body)
	}

	@ApiOperation({ summary: '角色信息-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev'], module: 'role', action: 'params' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeRoleResponse })
	@Get('info')
	async nodeRole(@Query() query: DTO.NodeRoleParameter) {
		return await this.roleService.nodeRole(query)
	}

	@ApiOperation({ summary: '角色列表-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev'], module: 'role', action: 'list' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeRolesResponse })
	@Get('list-node')
	async nodeRoles(@Query() query: DTO.NodeRolesParameter) {
		return await this.roleService.nodeRoles(query)
	}
}
