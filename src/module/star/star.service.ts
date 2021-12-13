import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Brackets } from 'typeorm'
import { UtilsService } from '@/module/utils/utils.service'
import { UserEntity } from '@/entity/user.entity'
import { StarEntity } from '@/entity/user.star.entity'
import * as DTO from './star.interface'

@Injectable()
export class StarService {
	constructor(
		private readonly utilsService: UtilsService,
		@InjectRepository(StarEntity) private readonly starModel: Repository<StarEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>
	) {}

	/**创建收藏**/
	public async nodeCreateStar({ one, type }: DTO.NodeCreateStarParameter, uid: number) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const star = await this.starModel.findOne({ where: { one, type, user } })
			if (!star) {
				/**未收藏**/
				const newStar = await this.starModel.create({ one, type, user })
				await this.starModel.save(newStar)
			} else if (star.status !== 1) {
				await this.starModel.update({ id: star.id }, { status: 1 })
			} else {
				throw new HttpException('已经收藏过了', HttpStatus.BAD_REQUEST)
			}

			return { message: '收藏成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**取消收藏**/
	public async nodeCancelStar({ one, type }: DTO.NodeCancelStarParameter, uid: number) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const star = await this.utilsService.validator({
				message: '收藏',
				empty: true,
				delete: true,
				disable: true,
				model: this.starModel,
				options: { where: { one, type, user } }
			})
			await this.starModel.update({ id: star.id }, { status: 0 })
			return { message: '取消成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**查询某个项目的收藏数量**/
	public async nodeStarTotal(props: { one: number; type: number }, uid?: number) {
		try {
			//查询当前用户是否已收藏该项目
			const user = await this.starModel
				.createQueryBuilder('t')
				.leftJoinAndSelect('t.user', 'user')
				.where(
					new Brackets(Q => {
						Q.andWhere('user.uid = :uid', { uid })
						Q.andWhere('t.status = :status', { status: 1 })
						Q.andWhere('t.type = :type', { type: props.type })
						Q.andWhere('t.one = :one', { one: props.one })
					})
				)
				.getOne()

			//查询收藏数
			const total = await this.starModel
				.createQueryBuilder('t')
				.where(
					new Brackets(Q => {
						Q.andWhere('t.status = :status', { status: 1 })
						Q.andWhere('t.type = :type', { type: props.type })
						Q.andWhere('t.one = :one', { one: props.one })
					})
				)
				.getCount()
			return { total, where: !!user }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
