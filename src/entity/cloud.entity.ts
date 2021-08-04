import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm'
import { DateEntity } from '@/entity/common.entity'
import { CloudSourceEntity } from '@/entity/cloud.source.entity'

@Entity('cloud')
export class CloudEntity extends DateEntity {
	@PrimaryGeneratedColumn({ comment: '自增长主键' })
	id: number

	@Column({ nullable: false, comment: '媒体标题' })
	title: string

	@Column({ nullable: false, comment: '媒体源文件名' })
	name: string

	@Column({ nullable: false, comment: '媒体源文件地址' })
	path: string

	@Column({ nullable: true, comment: '媒体封面' })
	cover: string

	@Column({ nullable: false, default: 1, comment: '媒体状态: 0.禁用 1.启用 2.删除' })
	status: number

	@Column({ nullable: false, default: 0, comment: '排序号' })
	order: number

	@Column({ nullable: true, default: 0, comment: '媒体文件大小' })
	size: number

	@Column({ nullable: true, comment: '媒体描述' })
	comment: string

	@ManyToMany(
		type => CloudSourceEntity,
		source => source.cloud,
		{ cascade: true }
	)
	@JoinTable({ name: 'cloud_source_join' })
	source: CloudSourceEntity[]
}
