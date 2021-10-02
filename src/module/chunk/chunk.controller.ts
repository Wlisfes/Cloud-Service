import { Controller, Post, Get, Body, Query, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { ChunkService } from './chunk.service'
import { AuthToken, AuthRole, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './chunk.interface'

@ApiTags('系统管理-版本资源模块')
@Controller('chunk')
export class ChunkController {
	constructor(private readonly chunkService: ChunkService) {}

	@ApiOperation({ summary: '创建版本资源-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'dev'], module: 'chunk', action: 'create' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCreateChunkResponse })
	@Post('create')
	async nodeCreateChunk(@Body() body: DTO.NodeCreateChunkParameter, @Req() req: { user: { uid: number } }) {
		return await this.chunkService.nodeCreateChunk(body, req.user.uid)
	}

	@ApiOperation({ summary: '版本资源信息-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev', 'visitor'], module: 'chunk', action: 'params' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeChunkResponse })
	@Get('info')
	async nodeChunk(@Query() query: DTO.NodeChunkParameter, @Req() req: { user: { uid: number } }) {
		return await this.chunkService.nodeChunk(query, req.user.uid)
	}

	@ApiOperation({ summary: '版本资源列表-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev', 'visitor'], module: 'chunk', action: 'list' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeChunksResponse })
	@Get('list-node')
	async nodeChunks(@Query() query: DTO.NodeChunksParameter, @Req() req: { user: { uid: number } }) {
		return await this.chunkService.nodeChunks(query, req.user.uid)
	}
}
