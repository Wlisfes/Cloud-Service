import { Entity, Tree, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm'
import { TreeChildren, TreeParent, TreeLevelColumn } from 'typeorm'
import { DateEntity } from '@/entity/common.entity'
import { UserEntity } from '@/entity/user.entity'

@Entity('role')
@Tree('nested-set')
export class RoleEntity extends DateEntity {
	@PrimaryGeneratedColumn({ comment: '自增长主键' })
	id: number

	@Column({ comment: '角色唯一标识', nullable: false })
	primary: string

	@Column({ comment: '角色名称', nullable: false })
	name: string

	@Column({
		comment: '状态',
		type: 'enum',
		enum: [0, 1],
		default: 1,
		nullable: false
	})
	status: number

	@TreeParent()
	parent: RoleEntity

	@TreeChildren()
	children: RoleEntity[]

	@OneToOne(
		type => UserEntity,
		user => user.role
	)
	@JoinColumn()
	user: UserEntity
}
