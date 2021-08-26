import { Entity, Column, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm'
import { BaseEntity } from '@/entity/common.entity'
import { UserEntity } from '@/entity/user.entity'
import { SourceEntity } from '@/entity/source.entity'

@Entity('article')
export class ArticleEntity extends BaseEntity {
	@Column({ nullable: false, comment: '文章标题' })
	title: string

	@Column({ nullable: false, comment: '文章封面' })
	cover: string

	@Column({ type: 'text', nullable: false, comment: '文章内容' })
	content: string

	@Column({ type: 'text', nullable: false, default: null, comment: '文章内容 html格式' })
	html: string

	@Column({ nullable: true, default: null, comment: '文章描述' })
	description: string

	@Column({ nullable: true, default: null, comment: '跳转链接' })
	url: string

	@Column({ nullable: false, default: 1, comment: '文章状态: 0.禁用 1.启用 2.删除' })
	status: number

	@Column({ nullable: false, default: 0, comment: '排序号' })
	order: number

	@Column({ nullable: false, default: 0, comment: '浏览量' })
	browse: number

	@ManyToOne(type => UserEntity)
	user: UserEntity

	@ManyToMany(
		type => SourceEntity,
		type => type.article,
		{ cascade: true }
	)
	@JoinTable({ name: 'article_source_join' })
	source: SourceEntity[]
}
