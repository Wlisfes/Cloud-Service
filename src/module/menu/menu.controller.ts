import { Controller, Get, Post, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { MenuService } from './menu.service'
import { AuthToken, AuthRole, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './menu.interface'

@ApiTags('系统管理-菜单模块')
@Controller('menu')
export class MenuController {
	constructor(private readonly menuService: MenuService) {}

	@ApiOperation({ summary: '创建菜单' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin'], module: 'menu', action: 'create' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK' })
	@Post('create')
	public async nodeCreate(@Body() body: DTO.NodeCreate) {
		return await this.menuService.nodeCreate(body)
	}

	@ApiOperation({ summary: '目录节点' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK' })
	@Get('conter')
	public async nodeMenuConter() {
		return await this.menuService.nodeMenuConter()
	}

	@ApiOperation({ summary: '动态路由节点' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK' })
	@Get('router')
	public async nodeRouter() {
		return await this.menuService.nodeRouter()
	}

	@ApiOperation({ summary: '菜单列表' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK' })
	@Get('list')
	public async nodeMenus() {
		return await this.menuService.nodeMenus()
	}
}
