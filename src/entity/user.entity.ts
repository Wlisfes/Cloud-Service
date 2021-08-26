import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm'
import { BaseEntity } from '@/entity/common.entity'
import { RoleEntity } from '@/entity/role.entity'
import { hashSync } from 'bcryptjs'

@Entity('user')
export class UserEntity extends BaseEntity {
	@BeforeInsert()
	BeforeCreate() {
		this.uid = Date.now()
	}

	@Column({ type: 'double', comment: 'uid', readonly: true })
	uid: number

	@Column({ comment: '角色标识', nullable: false, default: 'admin' })
	primary: string

	@Column({ comment: '账户', type: 'int', readonly: true })
	account: number

	@Column({ comment: '昵称', nullable: false })
	nickname: string

	@Column({ comment: '邮箱', nullable: true })
	email: string | null

	@Column({ comment: '头像', nullable: true })
	avatar: string | null

	@Column({ comment: '备注', nullable: true })
	comment: string | null

	@Column({
		comment: '手机号',
		type: 'double',
		nullable: true
	})
	mobile: number | null

	@Column({
		comment: '密码',
		select: false,
		nullable: false,
		transformer: {
			from: value => value,
			to: value => hashSync(value)
		}
	})
	password: string

	@Column({ comment: '状态', default: 1, nullable: false })
	status: number

	@OneToMany(
		type => RoleEntity,
		role => role.user,
		{ cascade: true }
	)
	role: RoleEntity[]
}
