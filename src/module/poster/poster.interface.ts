import { ApiProperty, ApiPropertyOptional, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsHexColor, IsNumber, Min } from 'class-validator'
import { IsOptional } from '@/decorator/common.decorator'
import { Type } from 'class-transformer'

export class PosterResponse {
	@ApiProperty({ description: '图床id', example: 1 })
	id: number

	@ApiProperty({ description: '类型 1、avatar 2、upload 3、cover', enum: [1, 2, 3] })
	type: number

	@ApiProperty({ description: '文件oss地址', example: 'https://oss.lisfes.cn/upload/1592634450167.jpg' })
	url: string

	@ApiProperty({ description: '文件oss路径', example: 'upload/1592634450167.jpg' })
	path: string

	@ApiProperty({ description: '状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2], example: 1 })
	status: number

	@ApiProperty({ description: '总数', example: 0 })
	total: number

	@ApiProperty({ description: '分页', example: 1 })
	page: number

	@ApiProperty({ description: '分页数量', example: 10 })
	size: number
}

export class PosterParameter {
	@ApiProperty({ description: '图床id', example: 1 })
	@IsNotEmpty({ message: '图床id 必填' })
	@Type(type => Number)
	id: number

	@ApiProperty({ description: '类型 1、avatar 2、upload 3、cover', enum: [1, 2, 3] })
	@IsNotEmpty({ message: '类型 必填' })
	@Type(type => Number)
	type: number

	@ApiProperty({ description: '文件oss地址', example: 'https://oss.lisfes.cn/upload/1592634450167.jpg' })
	@IsNotEmpty({ message: '文件oss地址 必填' })
	url: string

	@ApiProperty({ description: '文件oss路径', example: 'upload/1592634450167.jpg' })
	@IsNotEmpty({ message: '文件oss路径 必填' })
	path: string

	@ApiPropertyOptional({ description: '状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2] })
	@IsOptional({}, { string: true })
	@Type(type => Number)
	status: number

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
 * 创建图床-Parameter
 *************************************************************************************************/
export class NodeCreatePosterParameter extends PickType(PosterParameter, ['url', 'path', 'type']) {}
/**创建图床-Response**/
export class NodeCreatePosterResponse {
	@ApiProperty({ description: 'message', example: '创建成功' })
	message: string
}

/**
 *
 *
 * 切换图床状态-Parameter
 *************************************************************************************************/
export class NodePosterCutoverParameter extends PickType(PosterParameter, ['id']) {}
/**切换图床状态-Response**/
export class NodePosterCutoverResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**
 *
 *
 * 删除图床-Parameter
 *************************************************************************************************/
export class NodeDeletePosterParameter extends PickType(PosterParameter, ['id']) {}
/**删除图床-Response**/
export class NodeDeletePosterResponse {
	@ApiProperty({ description: 'message', example: '删除成功' })
	message: string
}

/**
 *
 *
 * 图床信息-Parameter
 *************************************************************************************************/
export class NodePosterParameter extends PickType(PosterParameter, ['id']) {}
/**图床信息-Response**/
export class NodePosterResponse extends IntersectionType(
	PickType(PosterParameter, ['id', 'type', 'url', 'path']),
	PickType(PosterParameter, ['status'])
) {}

/**
 *
 *
 * 图床列表-Parameter
 *************************************************************************************************/
export class NodePostersParameter extends PickType(PosterParameter, ['size', 'page', 'status']) {}
/**图床列表-Response**/
export class NodePostersResponse extends PickType(PosterResponse, ['size', 'page', 'total']) {
	@ApiProperty({ description: '图床列表', type: [NodePosterResponse], example: [] })
	list: NodePosterResponse[]
}
