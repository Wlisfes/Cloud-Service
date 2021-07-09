import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { DateEntity } from '@/entity/common.entity'
import { AuthEntity } from '@/entity/auth.entity'

@Entity('action')
export class ActionEntity extends DateEntity {
	@PrimaryGeneratedColumn({ comment: '自增长主键' })
	id: number

	@Column({ comment: '接口权限唯一标识', nullable: false })
	primary: string

	@Column({ comment: '接口权限名称', nullable: false })
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
		type => AuthEntity,
		type => type.action
	)
	auth: AuthEntity
}
