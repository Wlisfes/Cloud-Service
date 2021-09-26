import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Brackets } from 'typeorm'
import { isEmpty } from 'class-validator'
import { PosterEntity } from '@/entity/poster.entity'
import { UserEntity } from '@/entity/user.entity'
import * as DTO from './poster.interface'

@Injectable()
export class PosterService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(PosterEntity) private readonly posterModel: Repository<PosterEntity>
	) {}

	/**创建图片-授权管理端**/
	public async nodeCreatePoster(props: DTO.NodeCreatePosterParameter, uid: number) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const node = await this.posterModel.create({
				type: props.type,
				url: props.url,
				path: props.path,
				status: 1,
				user
			})
			await this.userModel.save(node)

			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**切换图片状态-授权管理端**/
	public async nodePosterCutover(props: DTO.NodePosterCutoverParameter, uid: number) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const node = await this.posterModel.findOne({ where: { id: props.id, user } })
			if (!node) {
				throw new HttpException('图片不存在', HttpStatus.BAD_REQUEST)
			} else if (node.status === 2) {
				throw new HttpException('图片已删除', HttpStatus.BAD_REQUEST)
			}
			await this.posterModel.update(
				{ id: props.id },
				{
					status: node.status ? 0 : 1
				}
			)

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**图片信息-授权管理端**/
	public async nodePoster(props: DTO.NodePosterParameter, uid: number) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const node = await this.posterModel.findOne({ where: { id: props.id, user } })
			if (!node) {
				throw new HttpException('图片不存在', HttpStatus.BAD_REQUEST)
			}

			return node
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**图片列表-授权管理端**/
	public async nodePosters(props: DTO.NodePostersParameter, uid: number) {
		try {
			const [list = [], total = 0] = await this.posterModel
				.createQueryBuilder('poster')
				.leftJoinAndSelect('poster.user', 'user')
				.where(
					new Brackets(Q => {
						Q.andWhere('user.uid = :uid', { uid })

						if (isEmpty(props.status)) {
							Q.andWhere('poster.status != :status', { status: 2 })
						} else {
							Q.andWhere('poster.status = :status', { status: props.status })
						}
					})
				)
				.skip((props.page - 1) * props.size)
				.take(props.size)
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

	/**删除图片-授权管理端**/
	public async nodeDeletePoster(props: DTO.NodeDeletePosterParameter, uid: number) {
		try {
			const user = await this.userModel.findOne({ where: { uid } })
			const node = await this.posterModel.findOne({ where: { id: props.id, user } })
			if (!node) {
				throw new HttpException('图片不存在', HttpStatus.BAD_REQUEST)
			} else if (node.status === 2) {
				throw new HttpException('图片已删除', HttpStatus.BAD_REQUEST)
			}
			await this.posterModel.update(
				{ id: props.id },
				{
					status: 2
				}
			)

			return { message: '删除成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
