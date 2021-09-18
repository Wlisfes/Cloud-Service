import { ApiProperty, ApiPropertyOptional, PickType, OmitType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { IsOptional } from '@/decorator/common.decorator'
import { toArrayNumber } from '@/utils/validate'

export class RoleResponse {
	@ApiProperty({ description: '角色id', example: 1 })
	id: number

	@ApiProperty({ description: '角色唯一标识', example: 'admin' })
	primary: string

	@ApiProperty({ description: '角色名称', example: '超级管理员' })
	name: string

	@ApiPropertyOptional({ description: '角色备注' })
	comment: string

	@ApiPropertyOptional({ description: '角色状态: 0.禁用 1.启用', enum: [0, 1] })
	status: number

	@ApiProperty({ description: '总数', example: 0 })
	total: number

	@ApiProperty({ description: '分页', example: 1 })
	page: number

	@ApiProperty({ description: '分页数量', example: 10 })
	size: number
}

export class RoleParameter {
	@ApiProperty({ description: '角色id', example: 1 })
	@IsNotEmpty({ message: '角色id 必填' })
	@Type(type => Number)
	id: number

	@ApiProperty({ description: '角色唯一标识', example: 'admin' })
	@IsNotEmpty({ message: '角色唯一标识 必填' })
	primary: string

	@ApiProperty({ description: '角色名称', example: '超级管理员' })
	@IsNotEmpty({ message: '角色名称 必填' })
	name: string

	@ApiPropertyOptional({ description: '角色备注' })
	@IsOptional({}, { string: true, number: true })
	comment: string

	@ApiPropertyOptional({ description: '角色状态: 0.禁用 1.启用', enum: [0, 1] })
	@IsOptional({}, { string: true })
	@Type(type => Number)
	status: number

	@ApiPropertyOptional({ description: '权限模块id', type: [Number], example: [] })
	@IsOptional({}, { string: true, number: true })
	@Transform(type => toArrayNumber(type), { toClassOnly: true })
	@IsNumber({}, { each: true, message: '权限模块id 必须为Array<number>' })
	module: number[]

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
 * 创建角色-Parameter
 *************************************************************************************************/
export class NodeCreateRoleParameter extends IntersectionType(
	PickType(RoleParameter, ['primary', 'name']),
	PickType(RoleParameter, ['comment', 'status', 'module'])
) {}
/**创建角色-Response**/
export class NodeCreateRoleResponse {
	@ApiProperty({ description: 'message', example: '创建成功' })
	message: string
}

/**
 *
 *
 * 修改角色-Parameter
 *************************************************************************************************/
export class NodeUpdateRoleParameter extends IntersectionType(
	PickType(RoleParameter, ['id', 'primary', 'name']),
	PickType(RoleParameter, ['comment', 'status', 'module'])
) {}
/**修改角色-Response**/
export class NodeUpdateRoleResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**
 *
 *
 * 切换角色状态-Parameter
 *************************************************************************************************/
export class NodeRoleCutoverParameter extends PickType(RoleParameter, ['id']) {}
/**切换角色状态-Response**/
export class NodeRoleCutoverResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**
 *
 *
 *角色信息-Parameter
 *************************************************************************************************/
export class NodeRoleParameter extends PickType(RoleParameter, ['id']) {}
/**角色信息-Response**/
export class NodeRoleResponse extends IntersectionType(
	PickType(RoleParameter, ['primary', 'name']),
	PickType(RoleParameter, ['comment', 'status', 'module'])
) {}

/**
 *
 *
 * 角色列表-Parameter
 *************************************************************************************************/
export class NodeRolesParameter extends PickType(RoleParameter, ['page', 'size', 'status']) {
	@ApiPropertyOptional({ description: '角色名称' })
	@IsOptional({}, { string: true, number: true })
	name: string
}
/**角色列表-Response**/
export class NodeRolesResponse extends PickType(RoleResponse, ['page', 'size', 'total']) {
	@ApiProperty({ description: '角色列表', type: [RoleResponse], example: [] })
	list: RoleResponse[]
}
