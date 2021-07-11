import { Controller, Get, Post, Put, Body, Query, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { RoleService } from './role.service'
import { AuthToken, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './role.interface'

@ApiTags('系统管理-角色模块')
@Controller('role')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@ApiOperation({ summary: '角色列表-不包括子类' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: [DTO.RoleResponse] })
	@Get('list')
	public async nodeRoles() {
		return await this.roleService.nodeRoles()
	}

	@ApiOperation({ summary: '角色列表-包括子类' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: [DTO.RoleResponse] })
	@Get('list-node')
	public async nodeRolesChild() {
		return await this.roleService.nodeRolesChild()
	}

	@ApiOperation({ summary: '角色信息' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.RoleResponse })
	@Get('node-id')
	public async nodeRole(@Query() query: DTO.NodeRole) {
		return await this.roleService.nodeRole(query.id)
	}

	@ApiOperation({ summary: '用户角色信息' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.RoleResponse })
	@Get('user')
	public async nodeUserRole(@Req() req: { user: { uid: number } }) {
		return await this.roleService.nodeUserRole(req.user.uid)
	}

	@ApiOperation({ summary: '修改角色权限' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK' })
	@Put('update')
	public async updateNodeRole(@Req() req: { user: { uid: number } }) {
		return 'ok'
	}

	@ApiOperation({ summary: '修改用户角色权限' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK' })
	@Put('update/user')
	public async updatenodeUserRole(@Req() req: { user: { uid: number } }) {
		return 'ok'
	}
}
