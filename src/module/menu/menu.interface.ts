import { ApiProperty, ApiPropertyOptional, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber } from 'class-validator'
import { IsOptional } from '@/decorator/common.decorator'
import { Type, Transform } from 'class-transformer'
import { toArrayNumber } from '@/utils/validate'

export class MenuResponse {
	@ApiProperty({ description: '节点id', example: 1 })
	id: number

	@ApiProperty({ description: '节点类型: 1.目录 2.菜单 3.权限', enum: [1, 2], example: 1 })
	type: number

	@ApiProperty({ description: '节点名称', example: '工作台' })
	name: string

	@ApiPropertyOptional({ description: '上级节点' })
	parent: MenuResponse

	@ApiPropertyOptional({ description: '节点路由' })
	router: string

	@ApiPropertyOptional({ description: '路由缓存: 0.关闭 1.开启', enum: [0, 1], example: 1 })
	keepAlive: number

	@ApiPropertyOptional({ description: '是否可见: 0.隐藏 1.显示', enum: [0, 1], example: 1 })
	visible: number

	@ApiPropertyOptional({ description: '节点状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2], example: 1 })
	status: number

	@ApiPropertyOptional({ description: '文件路径' })
	path: string

	@ApiPropertyOptional({ description: '节点图标' })
	icon: string

	@ApiPropertyOptional({ description: '排序号', example: 0 })
	order: number

	@ApiPropertyOptional({ description: '节点权限', type: [], example: [] })
	role: any[]

	@ApiProperty({ description: '节点子集', type: [MenuResponse], example: [] })
	children: MenuResponse[]
}

export class MenuParameter {
	@ApiProperty({ description: '节点id', example: 1 })
	@IsNotEmpty({ message: '节点id 必填' })
	@Type(type => Number)
	id: number

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

	@ApiPropertyOptional({ description: '是否可见: 0.隐藏 1.显示', enum: [0, 1], example: 1 })
	@IsOptional({}, { string: true, number: true })
	@Type(type => Number)
	visible: number

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

	@ApiProperty({ description: '节点权限' })
	@Transform(type => toArrayNumber(type), { toClassOnly: true })
	@IsNumber({}, { each: true, message: '权限id 必须为Array<number>' })
	role: number[]

	@ApiPropertyOptional({ description: '权限' })
	@IsOptional({}, { string: true, number: true })
	permission: string
}

/**
 *
 *
 * 创建菜单-Parameter
 *************************************************************************************************/
export class NodeCreateMenuParameter extends IntersectionType(
	PickType(MenuParameter, ['type', 'name', 'parent', 'router', 'role']),
	PickType(MenuParameter, ['keepAlive', 'visible', 'path', 'icon', 'order'])
) {}

/**创建菜单-Response**/
export class NodeCreateMenuResponse {
	@ApiProperty({ description: 'message', example: '创建成功' })
	message: string
}

/**
 *
 *
 * 获取节点目录-Response
 *************************************************************************************************/
export class NodeMenuConterResponse {
	@ApiProperty({ description: '节点目录列表', type: [MenuResponse], example: [] })
	list: MenuResponse[]
}

/**
 *
 *
 * 动态路由节点-Response
 *************************************************************************************************/
export class NodeRouterResponse {
	@ApiProperty({ description: '动态路由节点列表', type: [MenuResponse], example: [] })
	list: MenuResponse[]
}

/**
 *
 *
 * 角色菜单-Response
 *************************************************************************************************/
export class NodeRoleMenusResponse {
	@ApiProperty({ description: '角色菜单列表', type: [MenuResponse], example: [] })
	list: MenuResponse[]
}

/**
 *
 *
 * 菜单列表-Response
 *************************************************************************************************/
export class NodeMenusResponse {
	@ApiProperty({ description: '菜单列表', type: [MenuResponse], example: [] })
	list: MenuResponse[]
}

/**
 *
 *
 * 菜单信息-Parameter
 *************************************************************************************************/
export class NodeMenuParameter extends PickType(MenuParameter, ['id']) {}
export class NodeMenuResponse extends MenuResponse {}

/**
 *
 *
 * 修改菜单-Parameter
 *************************************************************************************************/
export class NodeUpdateParameter extends IntersectionType(
	PickType(MenuParameter, ['id', 'type', 'name', 'parent', 'router', 'role']),
	PickType(MenuParameter, ['keepAlive', 'visible', 'path', 'icon', 'order'])
) {}

/** 修改菜单-Response**/
export class NodeUpdateResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**
 *
 *
 * 切换菜单状态-Parameter
 *************************************************************************************************/
export class NodeMenuCutoverParameter extends PickType(MenuParameter, ['id']) {}
/** 切换菜单状态-Response**/
export class NodeMenuCutoverResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**
 *
 *
 * 删除菜单-Parameter
 *************************************************************************************************/
export class NodeDeleteMenuParameter extends PickType(MenuParameter, ['id']) {}
/** 修改菜单-Response**/
export class NodeDeleteMenuResponse {
	@ApiProperty({ description: 'message', example: '删除成功' })
	message: string
}
