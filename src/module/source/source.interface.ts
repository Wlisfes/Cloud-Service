import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { IsNotEmpty, IsHexColor, IsNumber, Min } from 'class-validator'
import { IsOptional } from '@/decorator/common.decorator'
import { Type } from 'class-transformer'

export class SourceResponse {
	@ApiProperty({ description: '标签id', example: 1 })
	id: number

	@ApiProperty({ description: '标签名称', example: '鬼畜' })
	name: number

	@ApiProperty({ description: '标签颜色', example: '#f93e3e' })
	color: number

	@ApiProperty({ description: '标签状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2], example: 1 })
	status: number

	@ApiProperty({ description: '排序号', example: 1 })
	order: number

	@ApiProperty({ description: '备注' })
	comment: string

	@ApiPropertyOptional({ description: '总数', example: 0 })
	total: number

	@ApiProperty({ description: '分页', example: 1 })
	page: number

	@ApiProperty({ description: '分页数量', example: 10 })
	size: number
}

export class SourceParameter {
	@ApiProperty({ description: '标签id', example: 1 })
	@IsNotEmpty({ message: '标签id 必填' })
	@Type(type => Number)
	id: number

	@ApiProperty({ description: '标签名称', example: '鬼畜' })
	@IsNotEmpty({ message: '标签名称 必填' })
	name: string

	@ApiProperty({ description: '标签颜色', example: '#f93e3e' })
	@IsNotEmpty({ message: '标签颜色 必填' })
	@IsHexColor({ message: '标签颜色 格式错误' })
	color: string

	@ApiPropertyOptional({ description: '标签状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2], example: 1 })
	@IsOptional({}, { string: true })
	@Type(type => Number)
	status: number

	@ApiPropertyOptional({ description: '排序号', example: 1 })
	@IsOptional({}, { string: true })
	@Type(type => Number)
	order: number

	@ApiPropertyOptional({ description: '备注' })
	@IsOptional({}, { string: true, number: true })
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
 * 创建分类标签-Parameter
 *************************************************************************************************/
export class NodeCreateSourceParameter extends PickType(SourceParameter, [
	'name',
	'color',
	'order',
	'status',
	'comment'
]) {}
/**创建分类标签-Response**/
export class NodeCreateSourceResponse {
	@ApiProperty({ description: 'message', example: '创建成功' })
	message: string
}
