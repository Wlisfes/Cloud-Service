import { ApiProperty, ApiPropertyOptional, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'
import { IsOptional } from '@/decorator/common.decorator'
import { Type, Transform } from 'class-transformer'
import { toArrayNumber } from '@/utils/validate'

class NodeCover {
	@ApiProperty({ description: '图床id', example: 1 })
	id: number
	@ApiProperty({ description: '类型 1、avatar 2、upload 3、cover 4、Photo', enum: [1, 2, 3, 4] })
	type: number
	@ApiProperty({ description: '文件oss地址', example: 'https://oss.lisfes.cn/upload/1592634450167.jpg' })
	url: string
	@ApiProperty({ description: '文件oss路径', example: 'upload/1592634450167.jpg' })
	path: string
}

export class PartnerResponse {
	@ApiProperty({ description: 'id', example: 1 })
	id: number

	@ApiProperty({ description: '标题' })
	title: string

	@ApiProperty({ description: 'MD内容' })
	content: string

	@ApiProperty({ description: 'MD内容 html格式' })
	html: string

	@ApiProperty({ description: '描述' })
	description: string

	@ApiPropertyOptional({ description: '封面列表id', type: [NodeCover], example: [] })
	cover: NodeCover[]

	@ApiPropertyOptional({ description: '状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2], example: 1 })
	status: number

	@ApiProperty({ description: '总数', example: 0 })
	total: number

	@ApiProperty({ description: '分页', example: 1 })
	page: number

	@ApiProperty({ description: '分页数量', example: 10 })
	size: number
}

export class PartnerParameter {
	@ApiProperty({ description: 'id', example: 1 })
	@IsNotEmpty({ message: 'id 必填' })
	@Type(type => Number)
	id: number

	@ApiProperty({ description: '标题' })
	@IsNotEmpty({ message: '标题 必填' })
	title: string

	@ApiProperty({ description: 'MD内容' })
	@IsNotEmpty({ message: 'MD内容 必填' })
	content: string

	@ApiProperty({ description: 'MD内容 html格式' })
	@IsNotEmpty({ message: 'MD内容html格式 必填' })
	html: string

	@ApiPropertyOptional({ description: '状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2], example: 1 })
	@IsOptional({}, { string: true })
	@Type(type => Number)
	status: number

	@ApiPropertyOptional({ description: '封面列表id', type: [Number], example: [] })
	@IsOptional({}, { string: true, number: true })
	@Transform(type => toArrayNumber(type), { toClassOnly: true })
	@IsNumber({}, { each: true, message: '封面列表 必须为Array<number>' })
	cover: number[]

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
 * 创建日志-Parameter
 *************************************************************************************************/
export class NodeCreatePartnerParameter extends IntersectionType(
	PickType(PartnerParameter, ['title', 'content', 'html']),
	PickType(PartnerParameter, ['status', 'cover'])
) {}
/**创建日志-Response**/
export class NodeCreatePartnerResponse {
	@ApiProperty({ description: 'message', example: '创建成功' })
	message: string
}

/**
 *
 *
 * 修改日志-Parameter
 *************************************************************************************************/
export class NodeUpdatePartnerParameter extends IntersectionType(
	PickType(PartnerParameter, ['id', 'title', 'content', 'html']),
	PickType(PartnerParameter, ['status', 'cover'])
) {}
/**修改日志-Response**/
export class NodeUpdatePartnerResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**
 *
 *
 * 切换日志状态-Parameter
 *************************************************************************************************/
export class NodePartnerCutoverParameter extends PickType(PartnerParameter, ['id']) {}
/**切换日志状态-Response**/
export class NodePartnerCutoverResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**
 *
 *
 * 日志信息-Parameter
 *************************************************************************************************/
export class NodePartnerParameter extends PickType(PartnerParameter, ['id']) {}
/**日志信息-Response**/
export class NodePartnerResponse extends IntersectionType(
	PickType(PartnerResponse, ['id', 'title', 'content', 'html']),
	PickType(PartnerResponse, ['status', 'cover', 'description'])
) {}

/**
 *
 *
 * 日志列表-Parameter
 *************************************************************************************************/
export class NodePartnersParameter extends PickType(PartnerParameter, ['page', 'size', 'status']) {}
/**日志列表-Response**/
export class NodePartnersResponse extends PickType(PartnerResponse, ['page', 'size', 'total']) {
	@ApiProperty({ description: '日志列表', type: [NodePartnerResponse], example: [] })
	list: NodePartnerResponse[]
}

/**
 *
 *
 * 删除日志-Parameter
 *************************************************************************************************/
export class NodeDeletePartnerParameter extends PickType(PartnerParameter, ['id']) {}
/**删除日志-Response**/
export class NodeDeletePartnerResponse {
	@ApiProperty({ description: 'message', example: '删除成功' })
	message: string
}
