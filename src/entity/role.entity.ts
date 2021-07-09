import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { DateEntity } from '@/entity/common.entity'
import { AuthEntity } from '@/entity/auth.entity'

@Entity('role')
export class RoleEntity extends DateEntity {
	@PrimaryGeneratedColumn({ comment: '自增长主键' })
	id: number

	@Column({ comment: '角色唯一标识', readonly: true })
	primary: string

	@Column({
		comment: '状态',
		type: 'enum',
		enum: [0, 1],
		default: 1,
		nullable: false
	})
	status: 0 | 1

	@OneToMany(
		type => AuthEntity,
		type => type.role,
		{ cascade: true }
	)
	auth: AuthEntity[]
}
