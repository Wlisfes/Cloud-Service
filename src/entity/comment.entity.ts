import { Entity, Column, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from '@/entity/common.entity'
import { UserEntity } from '@/entity/user.entity'

@Entity('comment')
export class CommentEntity extends BaseEntity {
	@Column({ nullable: false, comment: '评论类型ID' })
	one: number

	@Column({ nullable: false, comment: '评论类型 1.文章 2.媒体' })
	type: number

	@Column({ charset: 'utf8mb4', nullable: false, comment: '评论' })
	comment: string

	@Column({ nullable: false, default: 1, comment: '状态: 0.禁用 1.启用 2.删除' })
	status: number

	@ManyToOne(type => CommentEntity)
	parent: CommentEntity

	@OneToMany(
		type => CommentEntity,
		type => type.parent,
		{ cascade: true }
	)
	children: CommentEntity[]

	@ManyToOne(type => UserEntity)
	user: UserEntity
}
