import { Entity, Column, ManyToMany } from 'typeorm'
import { BaseEntity } from '@/entity/common.entity'
import { UserEntity } from '@/entity/user.entity'

@Entity('role')
export class RoleEntity extends BaseEntity {
	@Column({ comment: '角色唯一标识', nullable: false })
	primary: string

	@Column({ comment: '角色名称', nullable: false })
	name: string

	@Column({ comment: '角色备注', nullable: true })
	comment: string

	@Column({ nullable: false, default: 1, comment: '状态: 0.禁用 1.启用' })
	status: number

	@Column('simple-array', { nullable: true, default: null, comment: '权限列表' })
	action: string[]

	@ManyToMany(
		type => UserEntity,
		type => type.role
	)
	user: UserEntity[]
}
