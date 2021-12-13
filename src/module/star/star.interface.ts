import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class StarResponse {
	@ApiProperty({ description: '收藏id', example: 1 })
	id: number

	@ApiProperty({ description: '收藏类型ID', example: 1 })
	one: number

	@ApiProperty({ description: '收藏类型 1.文章 2.媒体', enum: [1, 2], example: 1 })
	type: number

	@ApiPropertyOptional({ description: '状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2], example: 1 })
	status: number

	@ApiProperty({ description: '总数', example: 0 })
	total: number

	@ApiProperty({ description: '分页', example: 1 })
	page: number

	@ApiProperty({ description: '分页数量', example: 10 })
	size: number
}

export class StarParameter {
	@ApiProperty({ description: '收藏id', example: 1 })
	@IsNotEmpty({ message: '收藏id 必填' })
	@Type(type => Number)
	id: number

	@ApiProperty({ description: '收藏类型ID', example: 1 })
	@IsNotEmpty({ message: '收藏类型ID 必填' })
	@Type(type => Number)
	one: number

	@ApiProperty({ description: '收藏类型', enum: [1, 2], example: 1 })
	@IsNotEmpty({ message: '收藏类型 必填' })
	@Type(type => Number)
	type: number

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
 * 创建收藏-Parameter
 *************************************************************************************************/
export class NodeCreateStarParameter extends PickType(StarParameter, ['type', 'one']) {}
/**创建收藏-Response**/
export class NodeCreateStarResponse {
	@ApiProperty({ description: 'message', example: '收藏成功' })
	message: string
}

/**
 *
 *
 * 取消收藏-Parameter
 *************************************************************************************************/
export class NodeCancelStarParameter extends PickType(StarParameter, ['type', 'one']) {}
/**取消收藏-Response**/
export class NodeCancelStarResponse {
	@ApiProperty({ description: 'message', example: '取消成功' })
	message: string
}
