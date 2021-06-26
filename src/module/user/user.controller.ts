import { Controller, Session, Post, Put, Get, Body, Query, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiHeader } from '@nestjs/swagger'
import { UserService } from './user.service'
import { AuthToken, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './user.interface'

@ApiTags('用户模块')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({ summary: '创建用户' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.UserCreateUserResponse })
	@Post('create')
	async createUser(@Body() body: DTO.CreateUser, @Session() session: { code: number }) {
		return await this.userService.createUser(body, session.code)
	}

	@ApiOperation({ summary: '用户登录' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.UserCreateUserResponse })
	@Post('login')
	async loginUser(@Body() body: DTO.LoginUser) {
		return await this.userService.loginUser(body)
	}

	@ApiOperation({ summary: '用户信息' })
	@ApiHeader({ name: APP_AUTH_TOKEN, required: true })
	@AuthToken({ login: true })
	@Get('info')
	async findUser(@Query() query, @Req() req) {
		console.log(req.user)
	}

	@ApiOperation({ summary: '更新用户' })
	@Put('update')
	async updateUser(@Body() body) {
		return await this.userService.updateUser(body)
	}

	@ApiOperation({ summary: '用户列表' })
	@Get('list')
	async findUsers(@Query() query) {
		return await this.userService.findUsers(query)
	}
}
