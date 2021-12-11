import { Controller, Post, Get, Put, Delete, Body, Query, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { CommentService } from './comment.service'
import { AuthToken, AuthRole, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './comment.interface'

@ApiTags('评论模块')
@Controller('comment')
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	@ApiOperation({ summary: '创建评论' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'comment', action: 'create' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCreateCommentResponse })
	@Post('create')
	async nodeCreateComment(@Body() body: DTO.NodeCreateCommentParameter, @Req() req: { user: { uid: number } }) {
		return await this.commentService.nodeCreateComment(body, req.user.uid)
	}

	@ApiOperation({ summary: '切换评论状态' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'comment', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCommentCutoverResponse })
	@Put('cutover')
	async nodeCommentCutover(@Body() body: DTO.NodeCommentCutoverParameter) {
		return await this.commentService.nodeCommentCutover(body)
	}

	@ApiOperation({ summary: '评论列表' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCommentsResponse })
	@Get('list-node')
	async nodeClouds(@Query() query: DTO.NodeCommentsParameter) {
		return await this.commentService.nodeComments(query)
	}

	@ApiOperation({ summary: '删除评论' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'comment', action: 'delete' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeDeleteCommentParameter })
	@Delete('del')
	async nodeDeleteComment(@Query() query: DTO.NodeDeleteCommentParameter) {
		return await this.commentService.nodeDeleteComment(query)
	}
}
