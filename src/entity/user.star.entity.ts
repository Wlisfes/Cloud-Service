import { Entity, Column, ManyToOne } from 'typeorm'
import { BaseEntity } from '@/entity/common.entity'
import { UserEntity } from '@/entity/user.entity'

@Entity('user_star')
export class StarEntity extends BaseEntity {
	@Column({ nullable: false, comment: '收藏类型ID' })
	one: number

	@Column({ nullable: false, comment: '收藏类型 1.文章 2.媒体' })
	type: number

	@Column({ nullable: false, default: 1, comment: '状态: 0.禁用 1.启用 2.删除' })
	status: number

	@ManyToOne(type => UserEntity)
	user: UserEntity
}
