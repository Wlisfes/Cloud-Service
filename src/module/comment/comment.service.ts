import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Brackets } from 'typeorm'
import { UtilsService } from '@/module/utils/utils.service'
import { UserEntity } from '@/entity/user.entity'
import { CommentEntity } from '@/entity/comment.entity'
import * as DTO from './comment.interface'

@Injectable()
export class CommentService {
	constructor(
		private readonly utilsService: UtilsService,
		@InjectRepository(CommentEntity) private readonly commentModel: Repository<CommentEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>
	) {}

	/**创建评论**/
	public async nodeCreateComment(props: DTO.NodeCreateCommentParameter, uid: number) {
		try {
			const parent = await this.utilsService.validator({
				message: '上级节点',
				disable: true,
				delete: true,
				model: this.commentModel,
				options: { where: { id: props.parent } }
			})
			const user = await this.userModel.findOne({ where: { uid } })
			const comment = await this.commentModel.create({
				comment: props.comment,
				type: props.type,
				one: props.one,
				parent,
				user
			})
			return await this.commentModel.save(comment)
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**切换评论状态**/
	public async nodeCommentCutover(props: DTO.NodeCommentCutoverParameter) {
		try {
			const comment = await this.utilsService.validator({
				message: '评论',
				empty: true,
				model: this.commentModel,
				options: { where: { id: props.id } }
			})
			await this.commentModel.update({ id: props.id }, { status: comment.status ? 0 : 1 })

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**评论列表**/
	public async nodeComments(props: DTO.NodeCommentsParameter) {
		try {
			const [list = [], total = 0] = await this.commentModel
				.createQueryBuilder('t')
				.where(
					new Brackets(Q => {
						Q.andWhere('t.parent IS :parent', { parent: null })
						Q.andWhere('t.type = :type', { type: props.type })
						Q.andWhere('t.one = :one', { one: props.one })
					})
				)
				.leftJoinAndSelect('t.user', 'user')
				.leftJoinAndSelect('t.children', 'children')
				.getManyAndCount()

			return {
				size: props.size,
				page: props.page,
				total,
				list
			}
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**删除评论**/
	public async nodeDeleteComment(props: DTO.NodeDeleteCommentParameter) {
		try {
			await this.utilsService.validator({
				message: '评论',
				empty: true,
				delete: true,
				model: this.commentModel,
				options: { where: { id: props.id } }
			})
			await this.commentModel.update({ id: props.id }, { status: 2 })

			return { message: '删除成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
