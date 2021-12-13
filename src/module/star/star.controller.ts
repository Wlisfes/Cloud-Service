import { Controller, Post, Get, Put, Delete, Body, Query, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AuthToken, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import { StarService } from './star.service'
import * as DTO from './star.interface'

@ApiTags('收藏模块')
@Controller('star')
export class StarController {
	constructor(private readonly starService: StarService) {}

	@ApiOperation({ summary: '创建收藏' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCreateStarResponse })
	@Post('create')
	async nodeCreateStar(@Body() body: DTO.NodeCreateStarParameter, @Req() req: { user: { uid: number } }) {
		return await this.starService.nodeCreateStar(body, req.user.uid)
	}

	@ApiOperation({ summary: '取消收藏' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCancelStarResponse })
	@Put('cancel')
	async nodeCancelStar(@Body() body: DTO.NodeCancelStarParameter, @Req() req: { user: { uid: number } }) {
		return await this.starService.nodeCancelStar(body, req.user.uid)
	}
}
