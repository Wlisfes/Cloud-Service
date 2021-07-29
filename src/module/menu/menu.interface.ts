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

	@ApiProperty({ description: '节点路由' })
	@IsNotEmpty({ message: '节点路由 必填' })
	router: string

	@ApiPropertyOptional({ description: '节点重定向地址' })
	@IsOptional({}, { string: true, number: true })
	redirect: string

	@ApiProperty({ description: '路由缓存: 0.关闭 1.开启', enum: [0, 1] })
	@IsNotEmpty({ message: '路由缓存 必填' })
	@Type(type => Number)
	keepAlive: number

	@ApiProperty({ description: '节点状态: 0.隐藏 1.显示', enum: [0, 1] })
	@IsNotEmpty({ message: '节点状态 必填' })
	@Type(type => Number)
	status: number

	@ApiProperty({ description: '文件路径' })
	@IsNotEmpty({ message: '文件路径 必填' })
	path: string

	@ApiPropertyOptional({ description: '节点图标' })
	@IsOptional({}, { string: true, number: true })
	icon: string

	@ApiPropertyOptional({ description: '排序号' })
	@IsOptional({}, { string: true, number: true })
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
	'redirect',
	'keepAlive',
	'status',
	'path',
	'icon',
	'order',
	'permission'
]) {}
