import { Controller, Get, Post, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { RoleService } from './role.service'

@ApiTags('系统管理-角色模块')
@Controller('role')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@ApiOperation({ summary: '角色列表' })
	@Get('list')
	public async findRoles() {
		return await this.roleService.findRoles()
	}
}
