import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleController } from './article.controller'
import { ArticleService } from './article.service'
import { ArticleEntity } from '@/entity/article.entity'
import { SourceEntity } from '@/entity/source.entity'
import { UserEntity } from '@/entity/user.entity'
import { ArticleCommentEntity } from '@/entity/article.comment.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, SourceEntity, ArticleEntity, ArticleCommentEntity])],
	controllers: [ArticleController],
	providers: [ArticleService]
})
export class ArticleModule {}
