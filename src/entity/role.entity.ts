import { Entity, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm'
import { BaseEntity } from '@/entity/common.entity'
import { UserEntity } from '@/entity/user.entity'
import { MenuEntity } from '@/entity/menu.entity'
import { ModuleEntity } from '@/entity/module.entity'

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

	@ManyToMany(
		type => ModuleEntity,
		type => type.role,
		{ cascade: true }
	)
	@JoinTable({ name: 'role_module_join' })
	module: ModuleEntity[]
}
