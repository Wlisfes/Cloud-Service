import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm'
import { DateEntity } from '@/entity/common.entity'
import { RoleEntity } from '@/entity/role.entity'
import { ActionEntity } from '@/entity/action.entity'

@Entity('auth')
export class AuthEntity extends DateEntity {
	@PrimaryGeneratedColumn({ comment: '自增长主键' })
	id: number

	@Column({ comment: '权限唯一标识', nullable: false })
	primary: string

	@Column({ comment: '权限名称', nullable: false })
	name: string

	@Column({
		comment: '状态',
		type: 'enum',
		enum: [0, 1],
		default: 1,
		nullable: false
	})
	status: number

	@ManyToOne(
		type => RoleEntity,
		type => type.auth
	)
	role: RoleEntity

	@OneToMany(
		type => ActionEntity,
		type => type.auth,
		{ cascade: true }
	)
	action: ActionEntity[]
}
