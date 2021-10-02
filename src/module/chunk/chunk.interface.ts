import { ApiProperty, ApiPropertyOptional, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { IsOptional } from '@/decorator/common.decorator'

export class ChunkResponse {
	@ApiProperty({ description: 'id', example: 1 })
	id: number

	@ApiProperty({ description: '文件oss地址' })
	url: string

	@ApiProperty({ description: '文件oss路径' })
	path: string

	@ApiProperty({ description: '版本号', example: 1 })
	version: number

	@ApiProperty({ description: '状态: 1.当前版本 2.历史版本', enum: [1, 2] })
	status: number

	@ApiProperty({ description: '总数', example: 0 })
	total: number

	@ApiProperty({ description: '分页', example: 1 })
	page: number

	@ApiProperty({ description: '分页数量', example: 10 })
	size: number
}

export class ChunkParameter {
	@ApiProperty({ description: 'id', example: 1 })
	@IsNotEmpty({ message: 'id 必填' })
	@Type(type => Number)
	id: number

	@ApiProperty({ description: '文件oss地址' })
	@IsNotEmpty({ message: '文件oss地址 必填' })
	url: string

	@ApiProperty({ description: '文件oss路径' })
	@IsNotEmpty({ message: '文件oss路径 必填' })
	path: string

	@ApiProperty({ description: '版本号' })
	@IsNotEmpty({ message: '版本号 必填' })
	@IsNumber({}, { message: '版本号必须是数字' })
	@Min(1, { message: '版本号不能小于1' })
	@Type(type => Number)
	version: number

	@ApiPropertyOptional({ description: '状态: 1.当前版本 2.历史版本', enum: [1, 2] })
	@IsOptional({}, { string: true, number: true })
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
 * 创建版本资源-Parameter
 *************************************************************************************************/
export class NodeCreateChunkParameter extends PickType(ChunkParameter, ['url', 'path', 'version']) {}
/**创建版本资源-Response**/
export class NodeCreateChunkResponse {
	@ApiProperty({ description: 'message', example: '创建成功' })
	message: string
}

/**
 *
 *
 * 版本资源信息-Parameter
 *************************************************************************************************/
export class NodeChunkParameter extends PickType(ChunkParameter, ['id']) {}
/**版本资源信息-Response**/
export class NodeChunkResponse extends IntersectionType(
	PickType(ChunkParameter, ['id', 'url', 'path', 'version']),
	PickType(ChunkParameter, ['status'])
) {}

/**
 *
 *
 * 版本资源列表-Parameter
 *************************************************************************************************/
export class NodeChunksParameter extends PickType(ChunkParameter, ['size', 'page', 'status']) {}
/**版本资源列表-Response**/
export class NodeChunksResponse extends PickType(ChunkResponse, ['size', 'page', 'total']) {
	@ApiProperty({ description: '版本资源列表', type: [ChunkResponse], example: [] })
	list: NodeChunkResponse[]
}
