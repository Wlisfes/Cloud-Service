import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToOne, OneToMany } from 'typeorm'
import { DateEntity } from '@/entity/common.entity'
import { RoleEntity } from '@/entity/role.entity'
import { hashSync } from 'bcryptjs'

@Entity('user')
export class UserEntity extends DateEntity {
	@BeforeInsert()
	BeforeCreate() {
		this.uid = Date.now()
	}

	@PrimaryGeneratedColumn({ comment: '自增长主键' })
	id: number

	@Column({ type: 'double', comment: 'uid', readonly: true })
	uid: number

	@Column({ comment: '账户', type: 'int', readonly: true })
	account: number

	@Column({ comment: '昵称', nullable: false })
	nickname: string

	@Column({ comment: '邮箱', nullable: true })
	email: string | null

	@Column({ comment: '头像', nullable: true })
	avatar: string | null

	@Column({ comment: '备注', nullable: true })
	comment: string

	@Column({
		comment: '手机号',
		type: 'double',
		nullable: true
	})
	mobile: number | null

	@Column({
		comment: '密码',
		nullable: false,
		transformer: {
			from: value => value,
			to: value => hashSync(value)
		}
	})
	password: string

	@Column({
		comment: '状态',
		type: 'enum',
		enum: [0, 1],
		default: 1,
		nullable: false
	})
	status: number

	@OneToMany(
		type => RoleEntity,
		role => role.user,
		{ cascade: true }
	)
	role: RoleEntity[]
}
