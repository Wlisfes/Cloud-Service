import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

export class ComputeParameter {
	@ApiProperty({ description: '图表类型', enum: [1, 2, 3, 4, 5], example: 1 })
	@IsNotEmpty({ message: '图表类型 必填' })
	@Type(() => Number)
	current: number
}

export class MonthTotal {
	@ApiProperty({ description: '总数数量', example: 1 })
	total: number
	@ApiProperty({ description: '当月数量', example: 1 })
	count: number
}

export class MonthGroupTotal {
	@ApiProperty({ description: '月份', example: 'YYYY-MM' })
	month: string
	@ApiProperty({ description: '当月数量', example: 1 })
	total: number
}

export class ComputeResponse {
	@ApiProperty({ description: '用户数量', type: [MonthTotal], example: { total: 1, count: 0 } })
	user: MonthTotal

	@ApiProperty({ description: '媒体数量', type: [MonthTotal], example: { total: 1, count: 0 } })
	cloud: MonthTotal

	@ApiProperty({ description: '文章数量', type: [MonthTotal], example: { total: 1, count: 0 } })
	article: MonthTotal

	@ApiProperty({ description: '收录数量', type: [MonthTotal], example: { total: 1, count: 0 } })
	minute: MonthTotal

	@ApiProperty({ description: '标签数量', type: [MonthTotal], example: { total: 1, count: 0 } })
	source: MonthTotal
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
	@ApiProperty({ description: '时间段数据列表', type: [MonthGroupTotal], example: [] })
	list: MonthGroupTotal[]
}
