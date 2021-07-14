import { Controller, Session, Post, Put, Get, Body, Query, Req, Response } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { UserService } from './user.service'
import { AuthToken, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './user.interface'

@ApiTags('用户模块')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({ summary: '登录验证码' })
	@ApiResponse({ status: 200, description: 'OK' })
	@Get('code')
	public async svgCode(@Session() session: { code: string }, @Response() res) {
		const { text, data } = await this.userService.createCode()
		session.code = text.toUpperCase()
		res.type('svg')
		res.send(data)
	}

	@ApiOperation({ summary: '创建用户' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.CreateUserResponse })
	@Post('create')
	async createUser(@Body() body: DTO.CreateUserParameter) {
		return await this.userService.createUser(body)
	}

	@ApiOperation({ summary: '用户登录' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.LoginUserResponse })
	@Post('login')
	async loginUser(@Body() body: DTO.LoginUserParameter, @Session() session: { code: string }) {
		return await this.userService.loginUser(body, session.code)
	}

	@ApiOperation({ summary: '更新用户信息' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.UpdateNodeUserResponse })
	@Put('update')
	async updateNodeUser(@Body() body: DTO.UpdateNodeUserParameter, @Req() req: { user: { uid: number } }) {
		return await this.userService.updateNodeUser(body, req.user.uid)
	}

	@ApiOperation({ summary: '更新用户邮箱' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.UpdateNodeUserEmailResponse })
	@Put('update-email')
	async updateNodeUserEmail(@Body() body: DTO.UpdateNodeUserEmailParameter, @Req() req: { user: { uid: number } }) {
		return await this.userService.updateNodeUserEmail(body, req.user.uid)
	}

	@ApiOperation({ summary: '用户信息' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.NodeUserResponse })
	@Get('info')
	async nodeUser(@Req() req: { user: { uid: number } }) {
		return await this.userService.nodeUidUser(req.user.uid)
	}

	@ApiOperation({ summary: '用户列表' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeUsersResponse })
	@Get('list')
	async nodeUsers(@Query() query: DTO.NodeUsersParameter) {
		return await this.userService.nodeUsers(query)
	}
}
