import { ApiProperty, ApiPropertyOptional, PickType, OmitType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { UserInterface } from '@/module/user/user.interface'
import { toArrayNumber } from '@/utils/validate'

class RoleInterface {
	@ApiProperty({ description: '角色、权限id', example: 1 })
	id: number

	@ApiProperty({ description: '角色、权限唯一标识', example: 'admin' })
	primary: string

	@ApiProperty({ description: '角色、权限名称', example: '超级管理员' })
	name: string

	@ApiProperty({ description: '角色、权限状态', enum: [0, 1], example: 1 })
	status: number

	@ApiProperty({ description: '角色、权限父级', type: RoleInterface, example: null })
	parent: number

	@ApiProperty({ description: '角色、权限子级', type: [RoleInterface], example: [] })
	children: RoleInterface[]

	@ApiProperty({ description: '角色、权限所属用户', type: OmitType(UserInterface, ['total']), example: null })
	user: UserInterface

	@ApiProperty({ description: '总数', example: 0 })
	total: number

	@ApiProperty({ description: '当前页', example: 1 })
	page: number

	@ApiProperty({ description: '当前页数量', example: 10 })
	size: number

	@ApiProperty({ description: '备注', example: '备注' })
	comment: string

	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

class RoleParameter {
	@ApiProperty({ description: '角色id', type: Number, example: 1 })
	@IsNotEmpty({ message: '角色id 必填' })
	@Type(type => Number)
	id: number

	@ApiProperty({ description: 'uid', example: 1624521523438 })
	@IsNotEmpty({ message: 'uid 必填' })
	@Type(type => Number)
	uid: number

	@ApiProperty({ description: '角色、权限唯一标识', example: 'admin' })
	@IsNotEmpty({ message: '角色、权限唯一标识 必填' })
	primary: string

	@ApiProperty({ description: '分页', type: Number, example: 1 })
	@IsNotEmpty({ message: 'page 必填' })
	@IsNumber({}, { message: 'page必须是数字' })
	@Min(1, { message: 'page不能小于1' })
	@Type(type => Number)
	page: number

	@ApiProperty({ description: '分页数量', type: Number, example: 10 })
	@IsNotEmpty({ message: 'size 必填' })
	@IsNumber({}, { message: 'size必须是数字' })
	@Min(1, { message: 'size不能小于1' })
	@Type(type => Number)
	size: number

	@ApiProperty({ description: '状态', enum: [0, 1], example: 0 | 1 })
	@IsNotEmpty({ message: '状态 必填' })
	@Type(type => Number)
	status: 1 | 0

	@ApiPropertyOptional({ description: '备注', example: '备注' })
	@IsOptional()
	comment: string

	@ApiPropertyOptional({ description: '权限id', type: [Number], example: [] })
	@IsOptional()
	@Transform(type => toArrayNumber(type), { toClassOnly: true })
	@IsNumber({}, { each: true, message: '权限id 必须为Array<number>' })
	role: number[]
}

/**
 *
 *
 * 角色、权限列表-Parameter
 *******************************************************************************************************************/
export class NodeRolesParameter extends PickType(RoleParameter, ['page', 'size']) {}
/**角色、权限列表-Response**/
export class NodeRolesResponse extends PickType(RoleInterface, ['total', 'page', 'size']) {
	@ApiProperty({
		description: '角色、权限列表',
		type: [PickType(RoleInterface, ['id', 'primary', 'name', 'status', 'children', 'user', 'comment'])],
		example: []
	})
	list: RoleInterface[]
}

/**
 *
 *
 * 角色信息-Parameter
 *******************************************************************************************************************/
export class NodeRoleParameter extends PickType(RoleParameter, ['id']) {}
/**角色信息-Response**/
export class NodeRoleResponse extends IntersectionType(
	PickType(RoleInterface, ['id', 'primary', 'name']),
	PickType(RoleInterface, ['status', 'children', 'comment'])
) {}

/**
 *
 *
 *切换角色状态-Parameter
 *******************************************************************************************************************/
export class NodeRoleCutoverParameter extends PickType(RoleParameter, ['id']) {}
/**切换角色状态-Response**/
export class NodeRoleCutoverResponse extends PickType(RoleInterface, ['message']) {}

/**
 *
 *
 *用户角色信息-Response
 *******************************************************************************************************************/
export class NodeUserRoleResponse extends IntersectionType(
	PickType(RoleInterface, ['id', 'primary', 'name', 'user']),
	PickType(RoleInterface, ['status', 'children', 'comment'])
) {}

/**
 *
 *
 *用户角色信息-uid-Parameter
 *******************************************************************************************************************/
export class NodeUserUidRoleParameter {
	@ApiProperty({ description: '用户uid', type: Number, example: 1624521523438 })
	@IsNotEmpty({ message: '用户uid 必填' })
	@Type(type => Number)
	uid: number
}

/**
 *
 *
 *修改角色权限-Parameter
 *******************************************************************************************************************/
export class NodeUpdateRoleParameter extends PickType(RoleParameter, ['id', 'status', 'comment', 'role']) {}
/**修改角色权限-Response**/
export class NodeUpdateRoleResponse extends PickType(RoleInterface, ['message']) {}

/**
 *
 *
 *修改用户角色权限-Parameter
 *******************************************************************************************************************/
export class NodeUpdateUserRoleParameter extends IntersectionType(
	PickType(RoleParameter, ['uid', 'primary', 'status']),
	PickType(RoleParameter, ['role', 'comment'])
) {}
/**修改用户角色权限-Response**/
export class NodeUpdateUserRoleResponse extends PickType(RoleInterface, ['message']) {}
