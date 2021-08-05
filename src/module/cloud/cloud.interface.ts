import { ApiProperty, ApiPropertyOptional, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsHexColor, IsNumber, Min, Allow } from 'class-validator'
import { IsOptional } from '@/decorator/common.decorator'
import { Type, Transform } from 'class-transformer'
import { toArrayNumber } from '@/utils/validate'
import { NodeCloudSourceResponse } from '@/module/cloud-source/cloud-source.interface'

export class CloudResponse {
	@ApiProperty({ description: '媒体id', example: 1 })
	id: number

	@ApiProperty({ description: '类型: 1.单集媒体 2.多集媒体', enum: [1, 2], example: 1 })
	type: number

	@ApiProperty({ description: '媒体标题', example: '星河里的鲸' })
	title: string

	@ApiProperty({ description: '媒体存在阿里云视频点播的VideoId' })
	key: string

	@ApiProperty({ description: '媒体源存在阿里云视频点播的文件名' })
	name: string

	@ApiProperty({ description: '媒体源存在阿里云视频点播的文件地址' })
	path: string

	@ApiProperty({ description: '媒体封面' })
	cover: string

	@ApiProperty({ description: '媒体状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2], example: 1 })
	status: number

	@ApiProperty({ description: '排序号', example: 1 })
	order: number

	@ApiProperty({ description: '媒体描述' })
	description: string

	@ApiProperty({ description: '类型为多集媒体的父类' })
	parent: CloudResponse

	@ApiProperty({ description: '类型为多集媒体的子类', type: [CloudResponse], example: [] })
	children: CloudResponse[]

	@ApiProperty({ description: '分类标签列表', type: [NodeCloudSourceResponse], example: [] })
	source: NodeCloudSourceResponse[]

	@ApiProperty({ description: '总数', example: 0 })
	total: number

	@ApiProperty({ description: '分页', example: 1 })
	page: number

	@ApiProperty({ description: '分页数量', example: 10 })
	size: number
}

export class CloudParameter {
	@ApiProperty({ description: '媒体id', example: 1 })
	@IsNotEmpty({ message: '媒体id 必填' })
	@Type(type => Number)
	id: number

	@ApiProperty({ description: '媒体类型: 1.单集媒体 2.多集媒体', enum: [1, 2], example: 1 })
	@IsNotEmpty({ message: '媒体类型 必填' })
	@Type(type => Number)
	type: number

	@ApiProperty({ description: '媒体标题', example: '时光背面的我' })
	@IsNotEmpty({ message: '媒体标题 必填' })
	title: string

	@ApiPropertyOptional({ description: '媒体存在阿里云视频点播的VideoId' })
	@IsOptional({}, { string: true, number: true })
	key: string

	@ApiPropertyOptional({ description: '媒体源存在阿里云视频点播的文件名' })
	@IsOptional({}, { string: true, number: true })
	name: string

	@ApiPropertyOptional({ description: '媒体源存在阿里云视频点播的文件地址' })
	@IsOptional({}, { string: true, number: true })
	path: string

	@ApiProperty({ description: '媒体封面', example: 'https://oss.lisfes.cn/upload/1592634450167.jpg' })
	@IsNotEmpty({ message: '媒体标题 必填' })
	cover: string

	@ApiPropertyOptional({ description: '媒体状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2] })
	@IsOptional({}, { string: true })
	@Type(type => Number)
	status: number

	@ApiPropertyOptional({ description: '排序号' })
	@IsOptional({}, { string: true })
	@Type(type => Number)
	order: number

	@ApiPropertyOptional({ description: '媒体描述' })
	@IsOptional({}, { string: true, number: true })
	description: string

	@ApiPropertyOptional({ description: '类型为多集媒体的父类id' })
	@IsOptional({}, { string: true, number: true })
	@IsNumber({}, { message: '父类id必须为number' })
	@Type(type => Number)
	parent: number

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
 * 创建音视频-Parameter
 *************************************************************************************************/
export class NodeCreateCloudParameter extends IntersectionType(
	PickType(CloudParameter, ['type', 'title', 'cover']),
	PickType(CloudParameter, ['key', 'name', 'path', 'status', 'order', 'description', 'parent', 'source'])
) {
	@ApiPropertyOptional({ description: '媒体文件大小', example: 0 })
	@IsOptional({}, { string: true })
	@Type(type => Number)
	size: number
}
/**创建音视频-Response**/
export class NodeCreateCloudResponse {
	@ApiProperty({ description: 'message', example: '创建成功' })
	message: string
}

/**
 *
 *
 * 修改音视频媒体-Parameter
 *************************************************************************************************/
export class NodeUpdateCloudParameter extends IntersectionType(
	PickType(CloudParameter, ['id', 'type', 'title', 'cover']),
	PickType(CloudParameter, ['key', 'name', 'path', 'status', 'order', 'description', 'parent', 'source'])
) {
	@ApiPropertyOptional({ description: '媒体文件大小', example: 0 })
	@IsOptional({}, { string: true })
	@Type(type => Number)
	size: number
}
/**修改音视频媒体-Response**/
export class NodeUpdateCloudResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**
 *
 *
 * 切换音视频媒体状态-Parameter
 *************************************************************************************************/
export class NodeCloudCutoverParameter extends PickType(CloudParameter, ['id']) {}
/**切换音视频媒体状态-Response**/
export class NodeCloudCutoverResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**
 *
 *
 * 音视频信息-Parameter
 *************************************************************************************************/
export class NodeCloudParameter extends PickType(CloudParameter, ['id']) {}
/**音视频信息-Response**/
export class NodeCloudResponse extends IntersectionType(
	PickType(CloudResponse, ['id', 'type', 'title', 'cover', 'key', 'name', 'path']),
	PickType(CloudResponse, ['status', 'order', 'description', 'parent', 'children', 'source'])
) {}

/**
 *
 *
 * 音视频列表-Parameter
 *************************************************************************************************/
export class NodeCloudsParameter extends PickType(CloudParameter, ['page', 'size', 'status']) {}
/**音视频列表-Response**/
export class NodeCloudsResponse extends PickType(CloudResponse, ['page', 'size', 'total']) {
	@ApiProperty({
		description: '音视频列表',
		type: [NodeCloudResponse],
		example: []
	})
	list: CloudResponse[]
}

/**
 *
 *
 * 多集媒体目录列表-Parameter
 *************************************************************************************************/
export class NodeMultipleCloudsParameter extends PickType(CloudParameter, ['page', 'size']) {}
/**多集媒体目录列表-Response**/
export class NodeMultipleCloudsResponse extends PickType(CloudResponse, ['page', 'size', 'total']) {
	@ApiProperty({
		description: '多集媒体目录列表',
		type: [NodeCloudResponse],
		example: []
	})
	list: CloudResponse[]
}

/**
 *
 *
 * 删除音视频媒体-Parameter
 *************************************************************************************************/
export class NodeDeleteCloudParameter extends PickType(CloudParameter, ['id']) {}
/**删除音视频媒体-Response**/
export class NodeDeleteCloudResponse {
	@ApiProperty({ description: 'message', example: '删除成功' })
	message: string
}
