import { Entity, Column, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm'
import { BaseEntity } from '@/entity/common.entity'
import { UserEntity } from '@/entity/user.entity'

@Entity('poster')
export class PosterEntity extends BaseEntity {
	@Column({ nullable: false, default: 1, comment: '图片类型 1、avatar 2、upload 3、cover' })
	type: number

	@Column({ nullable: false, comment: '文件oss路径' })
	url: string

	@Column({ nullable: false, comment: '文件oss路径' })
	path: string

	@Column({ comment: '状态: 0.禁用 1.启用 2.删除', default: 1, nullable: false })
	status: number

	@ManyToOne(type => UserEntity)
	user: UserEntity
}
