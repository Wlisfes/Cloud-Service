import { Controller, Get, Post, Body, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { RoleService } from './role.service'
import { AuthToken, APP_AUTH_TOKEN } from '@/guard/auth.guard'

@ApiTags('系统管理-角色模块')
@Controller('role')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@ApiOperation({ summary: '角色列表-不包括子类' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK' })
	@Get('list')
	public async nodeRoles() {
		return await this.roleService.nodeRoles()
	}

	@ApiOperation({ summary: '角色列表-包括子类' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK' })
	@Get('list-node')
	public async nodeRolesChild() {
		return await this.roleService.nodeRolesChild()
	}

	@ApiOperation({ summary: '角色信息' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK' })
	@Get('node-id')
	public async nodeRole() {
		return await this.roleService.nodeRole()
	}

	@ApiOperation({ summary: '用户角色信息' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK' })
	@Get('user')
	public async nodeUserRole(@Req() req: { user: { uid: number } }) {
		return await this.roleService.nodeUserRole(req.user.uid)
	}
}
