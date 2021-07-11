import { ApiProperty, ApiPropertyOptional, PickType, OmitType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
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
}

class RoleParameter {}

/**角色公用信息-RoleResponse**/
export class RoleResponse extends RoleInterface {}

/**角色信息-Parameter**/
export class NodeRole extends PickType(RoleInterface, ['id']) {}
