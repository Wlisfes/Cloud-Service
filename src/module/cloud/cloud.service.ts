import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, Not, Brackets } from 'typeorm'
import { isEmpty } from 'class-validator'
import { UtilsService } from '@/module/utils/utils.service'
import { CommentService } from '@/module/comment/comment.service'
import { StarService } from '@/module/star/star.service'
import { CloudEntity } from '@/entity/cloud.entity'
import { CloudSourceEntity } from '@/entity/cloud.source.entity'
import { UserEntity } from '@/entity/user.entity'
import * as DTO from './cloud.interface'

@Injectable()
export class CloudService {
	constructor(
		private readonly utilsService: UtilsService,
		private readonly commentService: CommentService,
		private readonly starService: StarService,
		@InjectRepository(CloudEntity) private readonly cloudModel: Repository<CloudEntity>,
		@InjectRepository(CloudSourceEntity) private readonly sourceModel: Repository<CloudSourceEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>
	) {}

	/**创建音视频-授权管理端**/
	public async nodeCreateCloud(props: DTO.NodeCreateCloudParameter, uid: number) {
		try {
			const parent = await this.utilsService.validator({
				message: '父级媒体',
				disable: true,
				delete: true,
				model: this.cloudModel,
				options: { where: { id: props.parent, status: Not(2) } }
			})
			const source = await Promise.all(
				(props.source || []).map(id => {
					return this.utilsService.validator({
						message: `标签id ${id}`,
						empty: true,
						disable: true,
						delete: true,
						model: this.cloudModel,
						options: { where: { id } }
					})
				})
			)

			const user = await this.userModel.findOne({ where: { uid } })
			const newCloud = await this.cloudModel.create({
				type: props.type,
				title: props.title,
				cover: props.cover,
				key: props.key || null,
				name: props.name || null,
				path: props.path || null,
				status: props.status || 0,
				order: props.order || 0,
				size: props.size || 0,
				description: props.description || null,
				source,
				parent,
				user
			})
			await this.cloudModel.save(newCloud)

			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**修改音视频媒体-授权管理端**/
	public async nodeUpdateCloud(props: DTO.NodeUpdateCloudParameter) {
		try {
			const cloud = await this.utilsService.validator({
				message: '音视频媒体',
				empty: true,
				model: this.cloudModel,
				options: { where: { id: props.id }, relations: ['source'] }
			})

			const parent = await this.utilsService.validator({
				message: '父级媒体',
				model: this.cloudModel,
				options: { where: { id: props.parent } }
			})

			//验证标签
			await Promise.all(
				(props.source || []).map(id => {
					return this.utilsService.validator({
						message: `标签id ${id}`,
						empty: true,
						model: this.sourceModel,
						options: { where: { id } }
					})
				})
			)

			//删除已有的标签
			await this.cloudModel
				.createQueryBuilder()
				.relation('source')
				.of(cloud)
				.addAndRemove(
					props.source,
					cloud.source.map(k => k.id)
				)

			await this.cloudModel.update(
				{ id: props.id },
				{
					type: props.type,
					title: props.title,
					cover: props.cover,
					key: props.key || null,
					name: props.name || null,
					path: props.path || null,
					status: props.status || 0,
					order: props.order || 0,
					size: props.size || 0,
					description: props.description || null,
					parent
				}
			)

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**切换音视频媒体状态-授权管理端**/
	public async nodeCloudCutover(props: DTO.NodeCloudCutoverParameter) {
		try {
			const cloud = await this.utilsService.validator({
				message: '音视频媒体',
				empty: true,
				delete: true,
				model: this.cloudModel,
				options: { where: { id: props.id } }
			})

			await this.cloudModel.update({ id: props.id }, { status: cloud.status ? 0 : 1 })

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**音视频信息-授权管理端**/
	public async nodeCloud(props: DTO.NodeCloudParameter) {
		try {
			const cloud = await this.utilsService.validator({
				message: '音视频媒体',
				empty: true,
				model: this.cloudModel,
				options: {
					where: { id: props.id },
					relations: ['source', 'parent', 'children', 'user']
				}
			})
			return {
				...cloud,
				children: cloud.children.sort((a, b) => a.order - b.order)
			}
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**音视频信息-客户端**/
	public async nodeClientCloud(props: DTO.NodeCloudParameter, uid?: number) {
		try {
			const cloud = await this.utilsService.validator({
				message: '音视频媒体',
				empty: true,
				delete: true,
				disable: true,
				model: this.cloudModel,
				options: {
					where: { id: props.id },
					relations: ['source', 'parent', 'children', 'user']
				}
			})

			//播放量加1
			await this.cloudModel.update({ id: props.id }, { browse: cloud.browse + 1 })

			return {
				...cloud,
				children: cloud.children.sort((a, b) => a.order - b.order),
				star: await this.starService.nodeStarTotal({ one: cloud.id, type: 2 }, uid)
			}
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**音视频列表-授权管理端**/
	public async nodeClouds(props: DTO.NodeCloudsParameter, uid: number) {
		try {
			const [list = [], total = 0] = await this.cloudModel
				.createQueryBuilder('cloud')
				.leftJoinAndSelect('cloud.user', 'user')
				.where(
					new Brackets(Q => {
						Q.where('user.uid = :uid', { uid })
						if (!isEmpty(props.type)) {
							Q.andWhere('cloud.type = :type', { type: props.type })
						}

						if (isEmpty(props.status)) {
							Q.andWhere('cloud.status != :status', { status: 2 })
						} else {
							Q.andWhere('cloud.status = :status', { status: props.status })
						}

						if (props.title) {
							Q.andWhere('cloud.title LIKE :title', { title: `%${props.title}%` })
							Q.orWhere('cloud.description LIKE :description', { description: `%${props.title}%` })
						}
					})
				)
				.orderBy({ 'cloud.id': 'DESC' })
				.skip((props.page - 1) * props.size)
				.take(props.size)
				.getManyAndCount()

			/**查询顶层评论总数、收藏总数**/
			const uesComment = list.map(async item => {
				return {
					...item,
					star: await this.starService.nodeStarTotal({ one: item.id, type: 2 }, uid),
					comment: await this.commentService.nodeCommentTotal({ one: item.id, type: 2 })
				}
			})

			return {
				size: props.size,
				page: props.page,
				total,
				list: await Promise.all(uesComment)
			}
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**音视频关键字搜索**/
	public async nodeSearchClouds(props: DTO.NodeCloudsParameter) {
		try {
			const [list = [], total = 0] = await this.cloudModel
				.createQueryBuilder('t')
				.select(['t.id', 't.title'])
				.where(
					new Brackets(Q => {
						if (!isEmpty(props.status)) {
							Q.andWhere('t.status = :status', { status: props.status })
						}

						if (props.title) {
							Q.andWhere('t.title LIKE :title', { title: `%${props.title}%` })
							Q.orWhere('t.description LIKE :description', { description: `%${props.title}%` })
						}
					})
				)
				.orderBy({ 't.id': 'DESC', 't.order': 'DESC' })
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

	/**音视频列表-客户端**/
	public async nodeClientClouds(props: DTO.NodeClientCloudsParameter, uid?: number) {
		try {
			const [list = [], total = 0] = await this.cloudModel
				.createQueryBuilder('cloud')
				.leftJoinAndSelect('cloud.user', 'user')
				.where(
					new Brackets(Q => {
						Q.andWhere('cloud.status = :status', { status: 1 })
						Q.andWhere('cloud.parent IS :parent', { parent: null })

						if (props.title) {
							Q.andWhere('cloud.title LIKE :title', { title: `%${props.title}%` })
							Q.orWhere('cloud.description LIKE :description', { description: `%${props.title}%` })
						}
					})
				)
				.orderBy({ 'cloud.id': 'DESC' })
				.skip((props.page - 1) * props.size)
				.take(props.size)
				.getManyAndCount()

			/**查询顶层评论总数、收藏总数**/
			const uesComment = list.map(async item => {
				return {
					...item,
					star: await this.starService.nodeStarTotal({ one: item.id, type: 2 }, uid),
					comment: await this.commentService.nodeCommentTotal({ one: item.id, type: 2 })
				}
			})

			return {
				size: props.size,
				page: props.page,
				total,
				list: await Promise.all(uesComment)
			}
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**删除音视频媒体-授权管理端**/
	public async nodeDeleteCloud(props: DTO.NodeDeleteCloudParameter) {
		try {
			const cloud = await this.utilsService.validator({
				message: '音视频媒体',
				empty: true,
				delete: true,
				model: this.cloudModel,
				options: {
					where: { id: props.id },
					relations: ['source', 'parent', 'children', 'user']
				}
			})
			await this.cloudModel.update({ id: props.id }, { status: 2 })

			return { message: '删除成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
