import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ArticleController } from './article.controller'
import { ArticleService } from './article.service'
import { CommentModule } from '@/module/comment/comment.module'
import { ArticleEntity } from '@/entity/article.entity'
import { SourceEntity } from '@/entity/source.entity'
import { UserEntity } from '@/entity/user.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, SourceEntity, ArticleEntity]), CommentModule],
	controllers: [ArticleController],
	providers: [ArticleService]
})
export class ArticleModule {}
