import { Entity, Column, ManyToMany } from 'typeorm'
import { BaseEntity } from '@/entity/common.entity'
import { CloudEntity } from '@/entity/cloud.entity'

@Entity('cloud_source')
export class CloudSourceEntity extends BaseEntity {
	@Column({ nullable: false, comment: '标签名称' })
	name: string

	@Column({ nullable: false, comment: '标签颜色' })
	color: string

	@Column({ nullable: false, default: 1, comment: '状态: 0.禁用 1.启用 2.删除' })
	status: number

	@Column({ nullable: false, default: 0, comment: '排序号' })
	order: number

	@Column({ charset: 'utf8mb4', comment: '标签备注', nullable: true })
	comment: string

	@ManyToMany(
		type => CloudEntity,
		cloud => cloud.source
	)
	cloud: CloudEntity[]
}
