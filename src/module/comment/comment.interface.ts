import { ApiProperty, ApiPropertyOptional, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'
import { IsOptional } from '@/decorator/common.decorator'
import { Type } from 'class-transformer'

export class CommentResponse {
	@ApiProperty({ description: '评论id', example: 1 })
	id: number

	@ApiProperty({ description: '评论类型 1.文章 2.媒体', enum: [1, 2], example: 1 })
	type: number

	@ApiProperty({ description: '评论类型ID', example: 1 })
	one: number

	@ApiPropertyOptional({ description: '状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2], example: 1 })
	status: number

	@ApiProperty({ description: '上级节点' })
	parent: CommentResponse

	@ApiProperty({ description: '总数', example: 0 })
	total: number

	@ApiProperty({ description: '分页', example: 1 })
	page: number

	@ApiProperty({ description: '分页数量', example: 10 })
	size: number
}

export class CommentParameter {
	@ApiProperty({ description: '评论id', example: 1 })
	@IsNotEmpty({ message: '评论id 必填' })
	@Type(type => Number)
	id: number

	@ApiProperty({ description: '评论类型ID', example: 1 })
	@IsNotEmpty({ message: '评论类型 必填' })
	@Type(type => Number)
	one: number

	@ApiProperty({ description: '评论类型', enum: [1, 2], example: 1 })
	@IsNotEmpty({ message: '评论类型 必填' })
	@Type(type => Number)
	type: number

	@ApiPropertyOptional({ description: '上级节点ID' })
	@IsOptional({}, { string: true, number: true })
	@Type(type => Number)
	parent: number

	@ApiProperty({ description: '评论内容' })
	@IsNotEmpty({ message: '评论内容 必填' })
	comment: string

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
 * 创建评论-Parameter
 *************************************************************************************************/
export class NodeCreateCommentParameter extends PickType(CommentParameter, ['type', 'one', 'comment', 'parent']) {}
/**创建评论-Response**/
export class NodeCreateCommentResponse {
	@ApiProperty({ description: 'message', example: '创建成功' })
	message: string
}

/**
 *
 *
 * 切换评论状态-Parameter
 *************************************************************************************************/
export class NodeCommentCutoverParameter extends PickType(CommentParameter, ['id']) {}
/**切换评论状态-Response**/
export class NodeCommentCutoverResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**
 *
 *
 * 评论列表Parameter
 *************************************************************************************************/
export class NodeCommentsParameter extends PickType(CommentParameter, ['one', 'type', 'page', 'size']) {}
/**评论列表Response**/
export class NodeCommentsResponse extends PickType(CommentResponse, ['page', 'size', 'total']) {
	@ApiProperty({ description: '评论列表', type: [CommentResponse], example: [] })
	list: CommentResponse[]
}

/**
 *
 *
 * 删除评论-Parameter
 *************************************************************************************************/
export class NodeDeleteCommentParameter extends PickType(CommentParameter, ['id']) {}
/**删除评论-Response**/
export class NodeDeleteCommentrResponse {
	@ApiProperty({ description: 'message', example: '删除成功' })
	message: string
}
