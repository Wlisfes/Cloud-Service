import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { DateEntity } from '@/entity/common.entity'
import { UserEntity } from '@/entity/user.entity'

@Entity('role')
export class RoleEntity extends DateEntity {
	@PrimaryGeneratedColumn({ comment: '自增长主键' })
	id: number

	@Column({ comment: '角色唯一标识', nullable: false })
	primary: string

	@Column({ comment: '角色名称', nullable: false })
	name: string

	@Column({ comment: '角色备注', nullable: true })
	comment: string

	@Column({
		comment: '状态',
		type: 'enum',
		enum: [0, 1],
		default: 1,
		nullable: false
	})
	status: number

	@Column({
		comment: '类型: 1.角色 2.功能 3.权限',
		type: 'enum',
		enum: [1, 2, 3],
		default: 3,
		nullable: false
	})
	type: number

	@ManyToOne(
		type => RoleEntity,
		role => role.children
	)
	parent: RoleEntity

	@OneToMany(
		type => RoleEntity,
		role => role.parent
	)
	children: RoleEntity[]

	@ManyToOne(
		type => UserEntity,
		user => user.role
	)
	user: UserEntity
}
