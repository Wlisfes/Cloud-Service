import { ApiProperty, ApiPropertyOptional, PickType, OmitType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsEmail, Length, Allow, IsNumber, Min } from 'class-validator'
import { Type } from 'class-transformer'

class MenuParameter {
	@ApiProperty({ description: '节点类型: 1.目录 2.菜单 3.权限', enum: [1, 2, 3], example: 1 })
	@IsNotEmpty({ message: '节点类型 必填' })
	@Type(type => Number)
	type: 1 | 2 | 3

	@ApiProperty({ description: '节点名称', example: '工作台' })
	@IsNotEmpty({ message: '节点名称 必填' })
	name: string

	@ApiPropertyOptional({ description: '上级节点' })
	@Allow()
	@Type(type => Number)
	parent: number

	@ApiPropertyOptional({ description: '节点路由' })
	@Allow()
	router: string

	@ApiPropertyOptional({ description: '路由缓存: 0.关闭 1.开启', enum: [0, 1] })
	@Allow()
	@Type(type => Number)
	keepAlive: 0 | 1

	@ApiPropertyOptional({ description: '是否显示: 0.隐藏 1.显示', enum: [0, 1] })
	@Allow()
	@Type(type => Number)
	visible: 0 | 1

	@ApiPropertyOptional({ description: '文件路径' })
	@Allow()
	path: string

	@ApiPropertyOptional({ description: '节点图标' })
	@Allow()
	icon: string | null

	@ApiPropertyOptional({ description: '排序号' })
	@Allow()
	@Type(type => Number)
	order: number

	@ApiPropertyOptional({ description: '权限' })
	@Allow()
	permission: string
}

/**创建菜单-Parameter**/
export class CreateMenu extends PickType(MenuParameter, [
	'type',
	'name',
	'parent',
	'router',
	'keepAlive',
	'visible',
	'path',
	'icon',
	'order',
	'permission'
]) {}
