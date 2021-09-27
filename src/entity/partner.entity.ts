import { Entity, Column, ManyToOne } from 'typeorm'
import { BaseEntity } from '@/entity/common.entity'
import { UserEntity } from '@/entity/user.entity'

interface NodeCover {
	id: number
	type: number
	url: string
	path: string
}

@Entity('partner')
export class PartnerEntity extends BaseEntity {
	@Column({ nullable: false, default: null, comment: '标题' })
	title: string

	@Column({ type: 'text', nullable: false, default: null, comment: 'MD内容' })
	content: string

	@Column({ type: 'text', nullable: false, default: null, comment: 'MD内容 html格式' })
	html: string

	@Column({ nullable: true, default: null, comment: '描述' })
	description: string

	@Column({ comment: '状态: 0.禁用 1.启用 2.删除', default: 1, nullable: false })
	status: number

	@Column('simple-json', { nullable: true, default: null, comment: '封面列表' })
	cover: NodeCover[]

	@ManyToOne(type => UserEntity)
	user: UserEntity
}
