import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'
import { UserEntity } from '@/entity/user.entity'
import { CommentEntity } from '@/entity/comment.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, CommentEntity])],
	controllers: [CommentController],
	providers: [CommentService],
	exports: [CommentService]
})
export class CommentModule {}
