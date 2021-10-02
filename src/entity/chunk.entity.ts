import { Entity, Column, ManyToOne } from 'typeorm'
import { BaseEntity } from '@/entity/common.entity'
import { UserEntity } from '@/entity/user.entity'

@Entity('chunk')
export class ChunkEntity extends BaseEntity {
	@Column({ nullable: false, comment: '文件oss地址' })
	url: string

	@Column({ nullable: false, comment: '文件oss路径' })
	path: string

	@Column({ nullable: false, default: 1, comment: '版本号' })
	version: number

	@Column({ comment: '状态: 1.当前版本 2.历史版本', default: 1, nullable: false })
	status: number

	@ManyToOne(type => UserEntity)
	user: UserEntity
}
