import { ApiProperty, ApiPropertyOptional, PickType, OmitType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsEmail, Length, IsNumber, Min } from 'class-validator'
import { IsOptional } from '@/decorator/common.decorator'
import { Type } from 'class-transformer'

class MenuParameter {
	@ApiProperty({ description: '节点类型: 1.目录 2.菜单 3.权限', enum: [1, 2], example: 1 })
	@IsNotEmpty({ message: '节点类型 必填' })
	@Type(type => Number)
	type: number

	@ApiProperty({ description: '节点名称', example: '工作台' })
	@IsNotEmpty({ message: '节点名称 必填' })
	name: string

	@ApiPropertyOptional({ description: '上级节点' })
	@IsOptional({}, { string: true, number: true })
	@Type(type => Number)
	parent: number

	@ApiPropertyOptional({ description: '节点路由' })
	@IsOptional({}, { string: true, number: true })
	router: string

	@ApiPropertyOptional({ description: '路由缓存: 0.关闭 1.开启', enum: [0, 1] })
	@IsOptional({}, { string: true, number: true })
	@Type(type => Number)
	keepAlive: number

	@ApiPropertyOptional({ description: '节点状态: 0.隐藏 1.显示', enum: [0, 1] })
	@IsOptional({}, { string: true, number: true })
	@Type(type => Number)
	status: number

	@ApiPropertyOptional({ description: '文件路径' })
	@IsOptional({}, { string: true, number: true })
	path: string

	@ApiPropertyOptional({ description: '节点图标' })
	@IsOptional({}, { string: true, number: true })
	icon: string

	@ApiPropertyOptional({ description: '排序号' })
	@IsOptional({}, { string: true })
	@Type(type => Number)
	order: number

	@ApiPropertyOptional({ description: '权限' })
	@IsOptional({}, { string: true, number: true })
	permission: string
}

/**创建菜单-Parameter**/
export class NodeCreate extends PickType(MenuParameter, [
	'type',
	'name',
	'parent',
	'router',
	'keepAlive',
	'status',
	'path',
	'icon',
	'order',
	'permission'
]) {}
