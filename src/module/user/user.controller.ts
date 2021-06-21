import { Controller, Post, Put, Get, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery, ApiHeader } from '@nestjs/swagger'
import { UserService } from './user.service'

@ApiTags('用户模块')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({ summary: '创建用户' })
	@Post('create')
	async createUser(@Body() body) {
		return await this.userService.createUser(body)
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
