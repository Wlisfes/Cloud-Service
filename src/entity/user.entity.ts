import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, BeforeInsert } from 'typeorm'

@Entity('user')
export class UserEntity {
	@PrimaryGeneratedColumn({ comment: '自增长主键' })
	id: number

	@Column({
		type: 'double',
		comment: 'uid',
		readonly: true
	})
	uid: number

	@Column({
		comment: '昵称',
		nullable: false
	})
	nickname: string

	@Column({
		comment: '邮箱',
		nullable: true
	})
	email: string | null

	@Column({
		comment: '手机号',
		length: 11,
		nullable: true,
		transformer: {
			from: value => (value ? Number(value) : null),
			to: value => String(value)
		}
	})
	mobile: string

	@Column({
		comment: '头像',
		nullable: true
	})
	avatar: string | null
}
