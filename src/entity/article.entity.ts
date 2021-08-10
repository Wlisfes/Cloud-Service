import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm'
import { DateEntity } from '@/entity/common.entity'
import { UserEntity } from '@/entity/user.entity'
import { SourceEntity } from '@/entity/source.entity'

@Entity('article')
export class ArticleEntity extends DateEntity {
	@PrimaryGeneratedColumn({ comment: '自增长主键' })
	id: number

	@Column({ nullable: false, comment: '文章标题' })
	title: string

	@Column({ nullable: false, comment: '文章封面' })
	cover: string

	@Column({ type: 'text', nullable: false, comment: '文章内容' })
	content: string

	@Column({ nullable: true, default: null, comment: '原文连接' })
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
