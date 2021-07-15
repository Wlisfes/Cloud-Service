import { ApiProperty, ApiPropertyOptional, PickType, PartialType, OmitType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { UserInterface } from '@/module/user/user.interface'

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
}

class RoleParameter {
	@ApiProperty({ description: '角色、权限id', example: 1 })
	@IsNotEmpty({ message: '角色、权限id 必填' })
	@Type(type => Number)
	id: number

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

	@ApiProperty({ description: '状态', enum: [0, 1], example: 0 | 1 })
	@IsNotEmpty({ message: '状态 必填' })
	@Type(type => Number)
	status: 1 | 0
}

/**角色、权限列表-Parameter***********************************************************************/
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

/**角色信息-Parameter***********************************************************************/
export class NodeRoleParameter extends PickType(RoleParameter, ['id']) {}
/**角色信息-Response**/
export class NodeRoleResponse extends PickType(RoleInterface, [
	'id',
	'primary',
	'name',
	'status',
	'children',
	'comment'
]) {}

/**用户角色信息-Response***********************************************************************/
export class NodeUserRoleResponse extends PickType(RoleInterface, [
	'user',
	'id',
	'primary',
	'name',
	'status',
	'children',
	'comment'
]) {}

/**修改角色权限-Parameter***********************************************************************/
export class UpdateNodeRoleParameter extends PickType(RoleParameter, ['id', 'status']) {}
/**修改角色权限-Response**/
export class UpdateNodeRoleResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**修改用户角色权限-Parameter***********************************************************************/
export class UpdateNodeUserRoleParameter extends PickType(RoleParameter, ['id', 'status']) {}
/**修改用户角色权限-Response**/
export class UpdateNodeUserRoleResponse extends UpdateNodeRoleResponse {}
