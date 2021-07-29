import { Controller, Get, Post, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { MenuService } from './menu.service'
import { AuthToken, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './menu.interface'

@ApiTags('系统管理-菜单模块')
@Controller('menu')
export class MenuController {
	constructor(private readonly menuService: MenuService) {}

	@ApiOperation({ summary: '创建菜单' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK' })
	@Post('create')
	public async nodeCreate(@Body() body: DTO.NodeCreate) {
		return await this.menuService.nodeCreate(body)
	}

	@ApiOperation({ summary: '菜单列表' })
	@Get('list')
	public async nodeMenus() {
		return await this.menuService.nodeMenus()
	}
}
