import { Controller, Post, Get, Put, Delete, Body, Req, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { ArticleService } from './article.service'
import { AuthToken, AuthRole, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './article.interface'

@ApiTags('归档管理-文章模块')
@Controller('article')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@ApiOperation({ summary: '创建文章-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'article', action: 'create' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCreateArticleResponse })
	@Post('create')
	async nodeCreateArticle(@Body() body: DTO.NodeCreateArticleParameter, @Req() req: { user: { uid: number } }) {
		return await this.articleService.nodeCreateArticle(body, req.user.uid)
	}

	@ApiOperation({ summary: '修改文章-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'article', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeUpdateArticleResponse })
	@Put('update')
	async nodeUpdateArticle(@Body() body: DTO.NodeUpdateArticleParameter) {
		return await this.articleService.nodeUpdateArticle(body)
	}

	@ApiOperation({ summary: '切换文章状态-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'article', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeArticleCutoverResponse })
	@Put('cutover')
	async nodeArticleCutover(@Body() body: DTO.NodeArticleCutoverParameter) {
		return await this.articleService.nodeArticleCutover(body)
	}

	@ApiOperation({ summary: '文章信息-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'article', action: 'params' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeArticleResponse })
	@Get('info')
	async nodeArticle(@Query() query: DTO.NodeArticleParameter) {
		return await this.articleService.nodeArticle(query)
	}

	@ApiOperation({ summary: '文章列表-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'article', action: 'params' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeArticlesResponse })
	@Get('list-node')
	async nodeArticles(@Query() query: DTO.NodeArticlesParameter, @Req() req: { user: { uid: number } }) {
		return await this.articleService.nodeArticles(query, req.user.uid)
	}

	@ApiOperation({ summary: '文章信息-客户端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true, error: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeArticleResponse })
	@Get('client/info')
	async nodeClientArticle(@Query() query: DTO.NodeArticleParameter, @Req() req: { user?: { uid: number } }) {
		return await this.articleService.nodeClientArticle(query, req.user?.uid)
	}

	@ApiOperation({ summary: '文章关键字搜索-客户端' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeArticlesResponse })
	@Get('client/keyword-node')
	async nodeSearchArticles(@Query() query: DTO.NodeArticlesParameter) {
		return await this.articleService.nodeSearchArticles(query)
	}

	@ApiOperation({ summary: '文章列表-客户端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true, error: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeArticlesResponse })
	@Get('client/list-node')
	async nodeClientArticles(@Query() query: DTO.NodeClientArticlesParameter, @Req() req: { user?: { uid: number } }) {
		return await this.articleService.nodeClientArticles(query, req.user?.uid)
	}

	@ApiOperation({ summary: '删除文章-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin', 'super', 'dev'], module: 'article', action: 'delete' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeDeleteArticleResponse })
	@Delete('del')
	async nodeDeleteArticle(@Query() query: DTO.NodeDeleteArticleParameter) {
		return await this.articleService.nodeDeleteArticle(query)
	}
}
