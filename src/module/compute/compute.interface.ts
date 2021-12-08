import { ApiProperty, ApiPropertyOptional, PickType, IntersectionType } from '@nestjs/swagger'

export class ComputeResponse {
	@ApiProperty({ description: '用户数量', example: 1 })
	user: number

	@ApiProperty({ description: '媒体数量', example: 0 })
	cloud: number

	@ApiProperty({ description: '文章数量', example: 0 })
	article: number

	@ApiProperty({ description: '收录数量', example: 0 })
	minute: number

	@ApiProperty({ description: '标签数量', example: 0 })
	source: number
}

/**
 *
 *
 * 各类总数统计-Response
 *************************************************************************************************/
export class NodeComputeTotalResponse extends IntersectionType(
	PickType(ComputeResponse, ['article', 'cloud', 'minute', 'source', 'user']),
	PickType(ComputeResponse, [])
) {}
