import { ApiProperty, ApiPropertyOptional, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'
import { IsOptional } from '@/decorator/common.decorator'
import { Type, Transform } from 'class-transformer'
import { toArrayNumber } from '@/utils/validate'
import { NodeSourceResponse } from '@/module/source/source.interface'

export class ArticleResponse {
	@ApiProperty({ description: '文章id', example: 1 })
	id: number

	@ApiProperty({ description: '文章标题', example: 'Git常用命令' })
	title: number

	@ApiProperty({ description: '文章封面', example: 'https://oss.lisfes.cn/cloud/cover/2021-08/1628335320412.jpg' })
	cover: number

	@ApiProperty({ description: '文章内容' })
	content: string

	@ApiProperty({ description: '文章内容 html格式' })
	html: string

	@ApiProperty({ description: '文章描述' })
	description: string

	@ApiProperty({ description: '跳转链接' })
	url: string

	@ApiProperty({ description: '文章状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2], example: 1 })
	status: number

	@ApiProperty({ description: '排序号', example: 1 })
	order: number

	@ApiProperty({ description: '浏览量', example: 0 })
	browse: number

	@ApiProperty({ description: '标签列表', type: [NodeSourceResponse], example: [] })
	source: NodeSourceResponse[]

	@ApiPropertyOptional({ description: '总数', example: 0 })
	total: number

	@ApiProperty({ description: '分页', example: 1 })
	page: number

	@ApiProperty({ description: '分页数量', example: 10 })
	size: number
}

export class ArticleParameter {
	@ApiProperty({ description: '文章id', example: 1 })
	@IsNotEmpty({ message: '文章id 必填' })
	@Type(type => Number)
	id: number

	@ApiProperty({ description: '文章标题', example: 'Git常用命令' })
	@IsNotEmpty({ message: '文章标题 必填' })
	title: string

	@ApiProperty({ description: '文章封面', example: 'https://oss.lisfes.cn/cloud/cover/2021-08/1628335320412.jpg' })
	@IsNotEmpty({ message: '文章封面 必填' })
	cover: string

	@ApiProperty({ description: '文章内容' })
	@IsNotEmpty({ message: '文章内容 必填' })
	content: string

	@ApiProperty({ description: '文章内容 html格式' })
	@IsNotEmpty({ message: '文章内容html格式 必填' })
	html: string

	@ApiPropertyOptional({ description: '跳转链接' })
	@IsOptional({}, { string: true, number: true })
	url: string

	@ApiPropertyOptional({ description: '文章状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2], example: 1 })
	@IsOptional({}, { string: true })
	@Type(type => Number)
	status: number

	@ApiPropertyOptional({ description: '排序号', example: 1 })
	@IsOptional({}, { string: true })
	@Type(type => Number)
	order: number

	@ApiPropertyOptional({ description: '分类标签id', type: [Number], example: [] })
	@IsOptional({}, { string: true, number: true })
	@Transform(type => toArrayNumber(type), { toClassOnly: true })
	@IsNumber({}, { each: true, message: '分类标签id 必须为Array<number>' })
	source: number[]

	@ApiProperty({ description: '分页', example: 1 })
	@IsNotEmpty({ message: 'page 必填' })
	@IsNumber({}, { message: 'page必须是数字' })
	@Min(1, { message: 'page不能小于1' })
	@Type(type => Number)
	page: number

	@ApiProperty({ description: '分页数量', example: 10 })
	@IsNotEmpty({ message: 'size 必填' })
	@IsNumber({}, { message: 'size必须是数字' })
	@Min(1, { message: 'size不能小于1' })
	@Type(type => Number)
	size: number
}

/**
 *
 *
 * 创建文章-Parameter
 *************************************************************************************************/
export class NodeCreateArticleParameter extends IntersectionType(
	PickType(ArticleParameter, ['title', 'cover', 'content', 'html', 'url', 'status']),
	PickType(ArticleParameter, ['order', 'source'])
) {}
/**创建文章-Response**/
export class NodeCreateArticleResponse {
	@ApiProperty({ description: 'message', example: '创建成功' })
	message: string
}

/**
 *
 *
 * 修改文章-Parameter
 *************************************************************************************************/
export class NodeUpdateArticleParameter extends IntersectionType(
	PickType(ArticleParameter, ['id', 'title', 'cover', 'content', 'html', 'url', 'status']),
	PickType(ArticleParameter, ['order', 'source'])
) {}
/**修改文章-Response**/
export class NodeUpdateArticleResponse {
	@ApiProperty({ description: 'message', example: '创建成功' })
	message: string
}

/**
 *
 *
 * 切换文章状态-Parameter
 *************************************************************************************************/
export class NodeArticleCutoverParameter extends PickType(ArticleParameter, ['id']) {}
/**切换文章状态-Response**/
export class NodeArticleCutoverResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**
 *
 *
 * 文章信息-Parameter
 *************************************************************************************************/
export class NodeArticleParameter extends PickType(ArticleParameter, ['id']) {}
/**文章信息-Response**/
export class NodeArticleResponse extends IntersectionType(
	PickType(ArticleResponse, ['id', 'title', 'cover', 'content', 'html', 'description']),
	PickType(ArticleResponse, ['order', 'browse', 'source', 'url', 'status'])
) {}

/**
 *
 *
 * 文章列表-Parameter
 *************************************************************************************************/
export class NodeClientArticlesParameter extends PickType(ArticleParameter, ['page', 'size']) {
	@ApiPropertyOptional({ description: '文章标题' })
	@IsOptional({}, { string: true, number: true })
	title: string

	@ApiPropertyOptional({ description: '分类标签id' })
	@IsOptional({}, { string: true, number: true })
	@Type(type => Number)
	source: number
}
export class NodeArticlesParameter extends PickType(ArticleParameter, ['page', 'size', 'status']) {
	@ApiPropertyOptional({ description: '文章标题' })
	@IsOptional({}, { string: true, number: true })
	title: string

	@ApiPropertyOptional({ description: '分类标签id' })
	@IsOptional({}, { string: true, number: true })
	@Type(type => Number)
	source: number
}

/**文章列表-Response**/
export class NodeArticlesResponse extends PickType(ArticleResponse, ['page', 'size', 'total']) {
	@ApiProperty({ description: '文章列表', type: [NodeArticleResponse], example: [] })
	list: NodeArticleResponse[]
}

/**
 *
 *
 * 删除文章-Parameter
 *************************************************************************************************/
export class NodeDeleteArticleParameter extends PickType(ArticleParameter, ['id']) {}
/**删除文章-Response**/
export class NodeDeleteArticleResponse {
	@ApiProperty({ description: 'message', example: '删除成功' })
	message: string
}
