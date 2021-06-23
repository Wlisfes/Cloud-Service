import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm'
import { DateEntity } from '@/entity/common.entity'
import { hashSync } from 'bcryptjs'

@Entity('user')
export class UserEntity extends DateEntity {
	@BeforeInsert()
	async BeforeCreate() {
		this.uid = Date.now()
	}

	@PrimaryGeneratedColumn({ comment: '自增长主键' })
	id: number

	@Column({ type: 'double', comment: 'uid', readonly: true })
	uid: number

	@Column({ comment: '昵称', nullable: false })
	nickname: string

	@Column({ comment: '邮箱', nullable: true })
	email: string | null

	@Column({ comment: '头像', nullable: true })
	avatar: string | null

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
		comment: '手机号',
		length: 11,
		nullable: true,
		transformer: {
			from: value => (value ? Number(value) : null),
			to: value => (value ? String(value) : null)
		}
	})
	mobile: string | null
}
