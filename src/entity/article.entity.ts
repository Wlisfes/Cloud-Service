import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm'
import { DateEntity } from '@/entity/common.entity'
import { UserEntity } from '@/entity/user.entity'
import { SourceEntity } from '@/entity/source.entity'

@Entity('article')
export class ArticleEntity {
	@PrimaryGeneratedColumn({ comment: '自增长主键' })
	id: number

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
