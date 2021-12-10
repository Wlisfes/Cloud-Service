import { Entity, Column, ManyToOne } from 'typeorm'
import { BaseEntity } from '@/entity/common.entity'
import { ArticleEntity } from '@/entity/article.entity'
import { UserEntity } from '@/entity/user.entity'

@Entity('article_comment')
export class ArticleCommentEntity extends BaseEntity {
	@Column({ nullable: false, comment: '评论' })
	comment: string

	@Column({ nullable: false, default: 1, comment: '状态: 0.禁用 1.启用 2.删除' })
	status: number

	@ManyToOne(type => ArticleCommentEntity)
	parent: ArticleCommentEntity

	@ManyToOne(type => ArticleEntity)
	article: ArticleEntity

	@ManyToOne(type => UserEntity)
	user: UserEntity
}
