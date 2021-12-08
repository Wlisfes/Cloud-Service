import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

export class ComputeParameter {
	@ApiProperty({ description: '图表类型', enum: [1, 2, 3, 4, 5], example: 1 })
	@IsNotEmpty({ message: '图表类型 必填' })
	@Type(() => Number)
	current: number
}

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
 * 各类总数统计-Response
 *************************************************************************************************/
export class NodeComputeTotalResponse extends IntersectionType(
	PickType(ComputeResponse, ['article', 'cloud', 'minute', 'source', 'user']),
	PickType(ComputeResponse, [])
) {}

/**
 *
 * 查询各类时间段数据-Parameter
 *************************************************************************************************/
export class NodeComputeGroupParameter extends PickType(ComputeParameter, ['current']) {}
/**查询各类时间段数据-Response**/
export class NodeComputeGroupResponse {
	@ApiProperty({ description: '时间段数据列表', type: [], example: [] })
	list: Array<{ month: string; total: string }>
}
