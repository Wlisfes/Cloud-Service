import { Controller, Get, Post, Put, Delete, Body, Query } from '@nestjs/common'
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
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCreateMenuResponse })
	@Post('create')
	public async nodeCreateMenu(@Body() body: DTO.NodeCreateMenuParameter) {
		return await this.menuService.nodeCreateMenu(body)
	}

	@ApiOperation({ summary: '目录节点' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeMenuConterResponse })
	@Get('conter')
	public async nodeMenuConter() {
		return await this.menuService.nodeMenuConter()
	}

	@ApiOperation({ summary: '动态路由节点' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeRouterResponse })
	@Get('router')
	public async nodeRouter() {
		return await this.menuService.nodeRouter()
	}

	@ApiOperation({ summary: '角色菜单' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeRoleMenusResponse })
	@Get('role')
	public async nodeRoleMenus() {
		return await this.menuService.nodeRoleMenus()
	}

	@ApiOperation({ summary: '菜单列表' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeMenusResponse })
	@Get('list')
	public async nodeMenus() {
		return await this.menuService.nodeMenus()
	}

	@ApiOperation({ summary: '菜单信息' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeMenuResponse })
	@Get('info')
	public async nodeMenu(@Query() query: DTO.NodeMenuParameter) {
		return await this.menuService.nodeMenu(query.id)
	}

	@ApiOperation({ summary: '修改菜单' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin'], module: 'menu', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeUpdateResponse })
	@Put('update')
	public async nodeUpdateMenu(@Body() body: DTO.NodeUpdateParameter) {
		return await this.menuService.nodeUpdateMenu(body)
	}

	@ApiOperation({ summary: '删除菜单' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin'], module: 'menu', action: 'delete' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeDeleteMenuResponse })
	@Delete('del')
	public async nodeDeleteMenu(@Query() query: DTO.NodeDeleteMenuParameter) {
		return await this.menuService.nodeDeleteMenu(query)
	}
}
