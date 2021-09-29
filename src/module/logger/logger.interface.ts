import { ApiProperty, ApiPropertyOptional, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'
import { IsOptional } from '@/decorator/common.decorator'
import { Type } from 'class-transformer'

export class LoggerResponse {
	@ApiProperty({ description: 'id', example: 1 })
	id: number

	@ApiPropertyOptional({ description: '来源地址' })
	referer: string

	@ApiPropertyOptional({ description: '来源ip' })
	ip: string

	@ApiPropertyOptional({ description: '请求地址' })
	path: string

	@ApiPropertyOptional({ description: '请求类型' })
	method: string

	@ApiPropertyOptional({ description: '请求状态 1、成功 2、错误', enum: [1, 2], example: 1 })
	type: number

	@ApiPropertyOptional({ description: 'body参数' })
	body: Object

	@ApiPropertyOptional({ description: 'query参数' })
	query: Object

	@ApiPropertyOptional({ description: 'params参数' })
	params: Object

	@ApiPropertyOptional({ description: '状态码' })
	code: number

	@ApiPropertyOptional({ description: '状态描述' })
	message: string

	@ApiPropertyOptional({ description: '状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2], example: 1 })
	status: number

	@ApiPropertyOptional({ description: '总数', example: 0 })
	total: number

	@ApiPropertyOptional({ description: '分页', example: 1 })
	page: number

	@ApiPropertyOptional({ description: '分页数量', example: 10 })
	size: number
}

export class LoggerParameter {
	@ApiProperty({ description: 'id', example: 1 })
	@IsNotEmpty({ message: 'id 必填' })
	@Type(type => Number)
	id: number

	@ApiPropertyOptional({ description: '来源地址' })
	@IsOptional({}, { string: true, number: true })
	referer: string

	@ApiPropertyOptional({ description: '来源ip' })
	@IsOptional({}, { string: true, number: true })
	ip: string

	@ApiPropertyOptional({ description: '请求地址' })
	@IsOptional({}, { string: true, number: true })
	path: string

	@ApiPropertyOptional({ description: '请求类型' })
	@IsOptional({}, { string: true, number: true })
	method: string

	@ApiPropertyOptional({ description: '请求状态 1、成功 2、错误', enum: [1, 2], example: 1 })
	@IsOptional({}, { string: true })
	@Type(type => Number)
	type: number

	@ApiPropertyOptional({ description: 'body参数' })
	@IsOptional({}, { string: true, number: true })
	body: Object

	@ApiPropertyOptional({ description: 'query参数' })
	@IsOptional({}, { string: true, number: true })
	query: Object

	@ApiPropertyOptional({ description: 'params参数' })
	@IsOptional({}, { string: true, number: true })
	params: Object

	@ApiPropertyOptional({ description: '状态码' })
	@IsOptional({}, { string: true })
	@Type(type => Number)
	code: number

	@ApiPropertyOptional({ description: '状态描述' })
	@IsOptional({}, { string: true, number: true })
	message: string

	@ApiPropertyOptional({ description: '状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2], example: 1 })
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
 * 创建Logger-Parameter
 *************************************************************************************************/
export class NodeCreateLoggerParameter extends IntersectionType(
	PickType(LoggerParameter, ['referer', 'ip', 'path', 'method', 'type']),
	PickType(LoggerParameter, ['body', 'query', 'params', 'code', 'message', 'status'])
) {}
/**创建Logger-Response**/
export class NodeCreateLoggerResponse {
	@ApiProperty({ description: 'message', example: '创建成功' })
	message: string
}

/**
 *
 *
 * 切换Logger状态-Parameter
 *************************************************************************************************/
export class NodeLoggerCutoverParameter extends PickType(LoggerParameter, ['id']) {}
/**切换Logger状态-Response**/
export class NodeLoggerCutoverResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**
 *
 *
 * Logger信息-Parameter
 *************************************************************************************************/
export class NodeLoggerParameter extends PickType(LoggerParameter, ['id']) {}
/**Logger信息-Response**/
export class NodeLoggerResponse extends IntersectionType(
	PickType(LoggerParameter, ['id', 'referer', 'ip', 'path', 'method', 'type']),
	PickType(LoggerParameter, ['body', 'query', 'params', 'code', 'message', 'status'])
) {}

/**
 *
 *
 * Logger列表-Parameter
 *************************************************************************************************/
export class NodeLoggersParameter extends PickType(LoggerParameter, ['page', 'size', 'type', 'status']) {}
/**Logger列表-Response**/
export class NodeLoggersResponse extends PickType(LoggerResponse, ['page', 'size', 'total']) {
	@ApiProperty({ description: 'Logger列表', type: [NodeLoggerResponse], example: [] })
	list: NodeLoggerResponse[]
}

/**
 *
 *
 * 删除Logger-Parameter
 *************************************************************************************************/
export class NodeDeleteLoggerParameter extends PickType(LoggerParameter, ['id']) {}
/**删除Logger-Response**/
export class NodeDeleteLoggerResponse {
	@ApiProperty({ description: 'message', example: '删除成功' })
	message: string
}
