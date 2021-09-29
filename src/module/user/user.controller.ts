import { Controller, Session, Post, Put, Get, Body, Query, Req, Response } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { UserService } from './user.service'
import { AuthToken, AuthRole, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './user.interface'

@ApiTags('系统管理-用户模块')
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

	@ApiOperation({ summary: '注册用户' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.RegisterUserResponse })
	@Post('register')
	async registerUser(@Body() body: DTO.RegisterUserParameter) {
		return await this.userService.registerUser(body)
	}

	@ApiOperation({ summary: '用户登录' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.LoginUserResponse })
	@Post('login')
	async loginUser(@Body() body: DTO.LoginUserParameter, @Session() session: { code: string }) {
		return await this.userService.loginUser(body, session.code)
	}

	@ApiOperation({ summary: '创建用户' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev'], module: 'user', action: 'create' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.CreateUserResponse })
	@Post('create')
	async createUser(@Body() body: DTO.CreateUserParameter) {
		return await this.userService.createUser(body)
	}

	@ApiOperation({ summary: '修改用户信息' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev'], module: 'user', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.NodeUpdateUserResponse })
	@Put('update')
	async nodeUpdateUser(@Body() body: DTO.NodeUpdateUserParameter) {
		return await this.userService.nodeUpdateUser(body)
	}

	@ApiOperation({ summary: '重置用户密码' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev'], module: 'user', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.NodeUpdatePwsUserResponse })
	@Put('update-reset')
	async nodeUpdatePwsUser(@Body() body: DTO.NodeUpdatePwsUserParameter) {
		return await this.userService.nodeUpdatePwsUser(body)
	}

	@ApiOperation({ summary: '更新用户邮箱' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev'], module: 'user', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.NodeUpdateUserEmailResponse })
	@Put('update-email')
	async nodeUpdateUserEmail(@Body() body: DTO.NodeUpdateUserEmailParameter, @Req() req: { user: { uid: number } }) {
		return await this.userService.nodeUpdateUserEmail(body, req.user.uid)
	}

	@ApiOperation({ summary: '切换用户状态' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev'], module: 'user', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeUserCutoverResponse })
	@Put('cutover')
	public async nodeUserCutover(@Body() body: DTO.NodeUserCutoverParameter) {
		return await this.userService.nodeUserCutover(body)
	}

	@ApiOperation({ summary: '用户信息-uid' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.NodeUserResponse })
	@Get('uid-info')
	async nodeUidUser(@Query() query: DTO.NodeUidUserParameter) {
		return await this.userService.nodeUidUser(query.uid)
	}

	@ApiOperation({ summary: '用户信息' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev', 'super', 'visitor'], module: 'user', action: 'params' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.NodeUserResponse })
	@Get('info')
	async nodeUser(@Req() req: { user: { uid: number } }) {
		return await this.userService.nodeUidUser(req.user.uid)
	}

	@ApiOperation({ summary: '用户列表' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev', 'super', 'visitor'], module: 'user', action: 'list' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeUsersResponse })
	@Get('list-node')
	async nodeUsers(@Query() query: DTO.NodeUsersParameter) {
		return await this.userService.nodeUsers(query)
	}
}
