import { ApiProperty, ApiPropertyOptional, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'
import { IsOptional } from '@/decorator/common.decorator'
import { Type, Transform } from 'class-transformer'
import { toArrayNumber } from '@/utils/validate'
import { NodeSourceResponse } from '@/module/source/source.interface'
import { NodeUserResponse } from '@/module/user/user.interface'

export class MinuteResponse {
	@ApiProperty({ description: '收录id', example: 1 })
	id: number

	@ApiProperty({ description: '收录名称', example: 'Git常用命令' })
	name: number

	@ApiProperty({ description: '跳转链接' })
	url: string

	@ApiProperty({ description: '收录描述' })
	description: string

	@ApiProperty({ description: '封面', example: 'https://oss.lisfes.cn/cloud/cover/2021-08/1628335320412.jpg' })
	cover: number

	@ApiProperty({ description: '收录状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2], example: 1 })
	status: number

	@ApiProperty({ description: '排序号', example: 1 })
	order: number

	@ApiProperty({ description: '收录用户', type: [NodeUserResponse] })
	user: NodeUserResponse

	@ApiProperty({ description: '标签列表', type: [NodeSourceResponse], example: [] })
	source: NodeSourceResponse[]

	@ApiProperty({ description: '总数', example: 0 })
	total: number

	@ApiProperty({ description: '分页', example: 1 })
	page: number

	@ApiProperty({ description: '分页数量', example: 10 })
	size: number
}

export class MinuteParameter {
	@ApiProperty({ description: '收录id', example: 1 })
	@IsNotEmpty({ message: '收录id 必填' })
	@Type(type => Number)
	id: number

	@ApiProperty({ description: '收录名称', example: 'ali-oss' })
	@IsNotEmpty({ message: '收录名称 必填' })
	name: string

	@ApiPropertyOptional({ description: '跳转链接' })
	@IsOptional({}, { string: true, number: true })
	url: string

	@ApiPropertyOptional({ description: '收录描述' })
	@IsOptional({}, { string: true, number: true })
	description: string

	@ApiProperty({ description: '封面', example: 'https://oss.lisfes.cn/cloud/cover/2021-08/1628335320412.jpg' })
	@IsNotEmpty({ message: '封面 必填' })
	cover: string

	@ApiPropertyOptional({ description: '收录状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2], example: 1 })
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
 * 创建收录-Parameter
 *************************************************************************************************/
export class NodeCreateMinuteParameter extends IntersectionType(
	PickType(MinuteParameter, ['name', 'cover', 'description', 'url', 'status']),
	PickType(MinuteParameter, ['order', 'source'])
) {}
/**创建收录-Response**/
export class NodeCreateMinuteResponse {
	@ApiProperty({ description: 'message', example: '创建成功' })
	message: string
}

/**
 *
 *
 * 修改收录-Parameter
 *************************************************************************************************/
export class NodeUpdateMinuteParameter extends IntersectionType(
	PickType(MinuteParameter, ['id', 'name', 'cover', 'description', 'url', 'status']),
	PickType(MinuteParameter, ['order', 'source'])
) {}
/**修改收录-Response**/
export class NodeUpdateMinuteResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**
 *
 *
 * 切换收录状态-Parameter
 *************************************************************************************************/
export class NodeMinuteCutoverParameter extends PickType(MinuteParameter, ['id']) {}
/**切换收录状态-Response**/
export class NodeMinuteCutoverResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**
 *
 *
 * 收录信息-Parameter
 *************************************************************************************************/
export class NodeMinuteParameter extends PickType(MinuteParameter, ['id']) {}
/**收录信息-Response**/
export class NodeMinuteResponse extends IntersectionType(
	PickType(MinuteResponse, ['id', 'name', 'cover', 'description']),
	PickType(MinuteResponse, ['order', 'user', 'source', 'url', 'status'])
) {}

/**
 *
 *
 * 收录列表-Parameter
 *************************************************************************************************/
export class NodeClientMinutesParameter extends PickType(MinuteParameter, ['page', 'size']) {
	@ApiPropertyOptional({ description: '收录名称' })
	@IsOptional({}, { string: true, number: true })
	name: string

	@ApiPropertyOptional({ description: '分类标签id' })
	@IsOptional({}, { string: true, number: true })
	@Type(type => Number)
	source: number
}
export class NodeMinutesParameter extends PickType(MinuteParameter, ['page', 'size', 'status']) {
	@ApiPropertyOptional({ description: '收录名称' })
	@IsOptional({}, { string: true, number: true })
	name: string

	@ApiPropertyOptional({ description: '分类标签id' })
	@IsOptional({}, { string: true, number: true })
	@Type(type => Number)
	source: number
}
/**收录列表-Response**/
export class NodeMinutesResponse extends PickType(MinuteResponse, ['page', 'size', 'total']) {
	@ApiProperty({ description: '收录列表', type: [MinuteResponse], example: [] })
	list: MinuteResponse[]
}

/**
 *
 *
 * 删除收录-Parameter
 *************************************************************************************************/
export class NodeDeleteMinuteParameter extends PickType(MinuteParameter, ['id']) {}
/**删除收录-Response**/
export class NodeDeleteMinuteResponse {
	@ApiProperty({ description: 'message', example: '删除成功' })
	message: string
}
