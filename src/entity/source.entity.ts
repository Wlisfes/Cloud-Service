import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm'
import { DateEntity } from '@/entity/common.entity'
import { ArticleEntity } from '@/entity/article.entity'

@Entity('source')
export class SourceEntity extends DateEntity {
	@PrimaryGeneratedColumn({ comment: '自增长主键' })
	id: number

	@Column({ nullable: false, comment: '标签名称' })
	name: string

	@Column({ nullable: false, comment: '标签颜色' })
	color: string

	@Column({ nullable: false, default: 1, comment: '状态: 0.禁用 1.启用 2.删除' })
	status: number

	@Column({ nullable: false, default: 0, comment: '排序号' })
	order: number

	@Column({ comment: '标签备注', nullable: true })
	comment: string

	@ManyToMany(
		type => ArticleEntity,
		type => type.source
	)
	article: ArticleEntity[]
}
