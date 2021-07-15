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
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeRolesResponse })
	@Get('list')
	public async nodeRoles(@Query() query: DTO.NodeRolesParameter) {
		return await this.roleService.nodeRoles(query)
	}

	@ApiOperation({ summary: '角色列表-包括子类' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeRolesResponse })
	@Get('list-node')
	public async nodeRolesChild(@Query() query: DTO.NodeRolesParameter) {
		return await this.roleService.nodeRolesChild(query)
	}

	@ApiOperation({ summary: '角色信息' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeRoleResponse })
	@Get('node')
	public async nodeRole(@Query() query: DTO.NodeRoleParameter) {
		return await this.roleService.nodeRole(query.id)
	}

	@ApiOperation({ summary: '用户角色信息' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeUserRoleResponse })
	@Get('user-node')
	public async nodeUserRole(@Req() req: { user: { uid: number } }) {
		return await this.roleService.nodeUserRole(req.user.uid)
	}

	@ApiOperation({ summary: '修改角色权限' })
	// @ApiBearerAuth(APP_AUTH_TOKEN)
	// @AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.UpdateNodeRoleResponse })
	@Put('update')
	public async updateNodeRole(@Body() body: DTO.UpdateNodeRoleParameter, @Req() req: { user: { uid: number } }) {
		return await this.roleService.updateNodeRole(body)
	}

	@ApiOperation({ summary: '修改用户角色权限' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.UpdateNodeUserRoleResponse })
	@Put('update/user')
	public async updateNodeUserRole(
		@Body() body: DTO.UpdateNodeUserRoleParameter,
		@Req() req: { user: { uid: number } }
	) {
		return this.roleService.updateNodeUserRole(body, req.user.uid)
	}
}
