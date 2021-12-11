import { Entity, Column, ManyToMany, JoinTable, ManyToOne } from 'typeorm'
import { BaseEntity } from '@/entity/common.entity'
import { UserEntity } from '@/entity/user.entity'
import { SourceEntity } from '@/entity/source.entity'

@Entity('minute')
export class MinuteEntity extends BaseEntity {
	@Column({ charset: 'utf8mb4', nullable: false, comment: '收录标题' })
	name: string

	@Column({ nullable: false, comment: '封面' })
	cover: string

	@Column({ charset: 'utf8mb4', nullable: true, default: null, comment: '收录描述' })
	description: string

	@Column({ nullable: true, default: null, comment: '跳转链接' })
	url: string

	@Column({ nullable: true, default: null, comment: 'npm链接' })
	npm: string

	@Column({ nullable: true, default: null, comment: 'github链接' })
	github: string

	@Column({ nullable: false, default: 1, comment: '收录状态: 0.禁用 1.启用 2.删除' })
	status: number

	@Column({ nullable: false, default: 0, comment: '排序号' })
	order: number

	@ManyToOne(type => UserEntity)
	user: UserEntity

	@ManyToMany(
		type => SourceEntity,
		type => type.article,
		{ cascade: true }
	)
	@JoinTable({ name: 'minute_source_join' })
	source: SourceEntity[]
}
