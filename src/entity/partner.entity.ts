import { Entity, Column, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm'
import { BaseEntity } from '@/entity/common.entity'
import { UserEntity } from '@/entity/user.entity'

@Entity('partner')
export class PartnerEntity extends BaseEntity {
	@Column({ nullable: false, comment: '标题' })
	title: string

	@Column({ type: 'text', nullable: false, comment: 'MD内容' })
	content: string

	@Column({ type: 'text', nullable: false, default: null, comment: 'MD内容 html格式' })
	html: string

	@Column({ comment: '状态: 0.禁用 1.启用 2.删除', default: 1, nullable: false })
	status: number

	@ManyToOne(type => UserEntity)
	user: UserEntity
}
