import { Controller, Post, Get, Put, Delete, Body, Query, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { PosterService } from './poster.service'
import { AuthToken, AuthRole, APP_AUTH_TOKEN } from '@/guard/auth.guard'

@ApiTags('云点播管理-图床模块')
@Controller('poster')
export class PosterController {
	constructor(private readonly posterService: PosterService) {}

	@ApiOperation({ summary: '创建图床信息-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super'], module: 'cloud', action: 'create' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK' })
	@Post('create')
	async nodeCreatePoster(@Body() body, @Req() req: { user: { uid: number } }) {}
}
