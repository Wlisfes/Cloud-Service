import { Controller, Post, Get, Put, Delete, Body, Query, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { PosterService } from './poster.service'
import { AuthToken, AuthRole, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './poster.interface'

@ApiTags('云点播管理-图床模块')
@Controller('poster')
export class PosterController {
	constructor(private readonly posterService: PosterService) {}

	@ApiOperation({ summary: '创建图床信息-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'poster', action: 'create' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCreatePosterResponse })
	@Post('create')
	async nodeCreatePoster(@Body() body: DTO.NodeCreatePosterParameter, @Req() req: { user: { uid: number } }) {
		return await this.posterService.nodeCreatePoster(body, req.user.uid)
	}

	@ApiOperation({ summary: '切换图片状态-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'poster', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodePosterCutoverResponse })
	@Put('cutover')
	async nodePosterCutover(@Body() body: DTO.NodePosterCutoverParameter, @Req() req: { user: { uid: number } }) {
		return await this.posterService.nodePosterCutover(body, req.user.uid)
	}

	@ApiOperation({ summary: '图片信息-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'poster', action: 'params' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodePosterResponse })
	@Get('info')
	async nodePoster(@Query() query: DTO.NodePosterParameter, @Req() req: { user: { uid: number } }) {
		return await this.posterService.nodePoster(query, req.user.uid)
	}

	@ApiOperation({ summary: '图片列表-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'poster', action: 'list' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodePostersResponse })
	@Get('list-node')
	async nodePosters(@Query() query: DTO.NodePostersParameter, @Req() req: { user: { uid: number } }) {
		return await this.posterService.nodePosters(query, req.user.uid)
	}

	@ApiOperation({ summary: '删除图片-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super'], module: 'poster', action: 'delete' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeDeletePosterResponse })
	@Delete('del')
	async nodeDeletePoster(@Query() query: DTO.NodeDeletePosterParameter, @Req() req: { user: { uid: number } }) {
		return await this.posterService.nodeDeletePoster(query, req.user.uid)
	}
}
