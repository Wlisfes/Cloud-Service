import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'
import { CommentEntity } from '@/entity/comment.entity'

@Injectable()
export class CommentService {
	constructor(
		@InjectRepository(CommentEntity) private readonly commentModel: Repository<CommentEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>
	) {}
}
