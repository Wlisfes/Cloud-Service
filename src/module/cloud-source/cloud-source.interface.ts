import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { IsNotEmpty, IsHexColor, IsNumber, Min } from 'class-validator'
import { IsOptional } from '@/decorator/common.decorator'
import { Type } from 'class-transformer'

export class CloudSourceResponse {
	@ApiProperty({ description: '分类标签id', example: 1 })
	id: number

	@ApiProperty({ description: '分类标签名称', example: '鬼畜' })
	name: number

	@ApiProperty({ description: '分类标签颜色', example: '#f93e3e' })
	color: number

	@ApiProperty({ description: '分类标签状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2], example: 1 })
	status: number

	@ApiProperty({ description: '排序号', example: 1 })
	order: number

	@ApiPropertyOptional({ description: '总数', example: 0 })
	total: number

	@ApiProperty({ description: '分页', example: 1 })
	page: number

	@ApiProperty({ description: '分页数量', example: 10 })
	size: number
}

export class CloudSourceParameter {
	@ApiProperty({ description: '分类标签id', example: 1 })
	@IsNotEmpty({ message: '分类标签id 必填' })
	@Type(type => Number)
	id: number

	@ApiProperty({ description: '分类标签名称', example: '鬼畜' })
	@IsNotEmpty({ message: '分类标签名称 必填' })
	name: string

	@ApiProperty({ description: '分类标签颜色', example: '#f93e3e' })
	@IsNotEmpty({ message: '分类标签颜色 必填' })
	@IsHexColor({ message: '分类标签颜色 格式错误' })
	color: string

	@ApiPropertyOptional({ description: '分类标签状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2], example: 1 })
	@IsOptional({}, { string: true })
	@Type(type => Number)
	status: number

	@ApiPropertyOptional({ description: '排序号', example: 1 })
	@IsOptional({}, { string: true })
	@Type(type => Number)
	order: number

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
export class NodeCreateCloudSourceParameter extends PickType(CloudSourceParameter, [
	'name',
	'color',
	'order',
	'status'
]) {}
/**创建分类标签-Response**/
export class NodeCreateCloudSourceResponse {
	@ApiProperty({ description: 'message', example: '创建成功' })
	message: string
}

/**
 *
 *
 * 修改分类标签-Parameter
 *************************************************************************************************/
export class NodeUpdateCloudSourceParameter extends PickType(CloudSourceParameter, [
	'id',
	'name',
	'color',
	'order',
	'status'
]) {}
/**修改分类标签-Response**/
export class NodeUpdateCloudSourceResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**
 *
 *
 * 切换分类标签状态-Parameter
 *************************************************************************************************/
export class NodeCloudSourceCutoverParameter extends PickType(CloudSourceParameter, ['id']) {}
/**切换分类标签状态-Response**/
export class NodeCloudSourceCutoverResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**
 *
 *
 * 分类标签信息-Parameter
 *************************************************************************************************/
export class NodeCloudSourceParameter extends PickType(CloudSourceParameter, ['id']) {}
/**分类标签信息-Response**/
export class NodeCloudSourceResponse extends PickType(CloudSourceResponse, [
	'id',
	'name',
	'color',
	'order',
	'status'
]) {}

/**
 *
 *
 * 分类标签列表-Parameter
 *************************************************************************************************/
export class NodeCloudSourcesParameter extends PickType(CloudSourceParameter, ['size', 'page', 'status']) {}
/**分类标签列表-Response**/
export class NodeCloudSourcesResponse extends PickType(CloudSourceResponse, ['total', 'page', 'size']) {
	@ApiProperty({
		description: '分类标签列表',
		type: [PickType(CloudSourceResponse, ['id', 'name', 'color', 'status', 'order'])],
		example: []
	})
	list: CloudSourceResponse[]
}

/**
 *
 *
 * 删除分类标签-Parameter
 *************************************************************************************************/
export class NodeDeleteCloudSourceParameter extends PickType(CloudSourceParameter, ['id']) {}
/**删除分类标签-Response**/
export class NodeDeleteCloudSourceResponse {
	@ApiProperty({ description: 'message', example: '删除成功' })
	message: string
}
