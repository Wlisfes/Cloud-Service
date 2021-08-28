import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, Not, Like, Brackets } from 'typeorm'
import { isEmpty } from 'class-validator'
import { MinuteEntity } from '@/entity/minute.entity'
import { UserEntity } from '@/entity/user.entity'
import { SourceEntity } from '@/entity/source.entity'
import * as DTO from './minute.interface'

@Injectable()
export class MinuteService {
	constructor(
		@InjectRepository(MinuteEntity) private readonly minuteModel: Repository<MinuteEntity>,
		@InjectRepository(SourceEntity) private readonly sourceModel: Repository<SourceEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>
	) {}

	/**创建收录-授权管理端**/
	public async nodeCreateMinute(props: DTO.NodeCreateMinuteParameter, uid: number) {
		try {
			let source = []
			if (props.source?.length > 0) {
				source = await this.sourceModel.find({ where: { id: In(props.source) } })
				props.source.forEach(id => {
					const element = source.find(element => element.id === id)
					if (!element) {
						throw new HttpException(`标签id ${id} 不存在`, HttpStatus.BAD_REQUEST)
					} else if (element?.status === 0) {
						throw new HttpException(`标签 ${element.name} 已禁用`, HttpStatus.BAD_REQUEST)
					} else if (element?.status === 2) {
						throw new HttpException(`标签 ${element.name} 已删除`, HttpStatus.BAD_REQUEST)
					}
				})
			}

			const user = await this.userModel.findOne({ where: { uid } })
			const newMinute = await this.minuteModel.create({
				name: props.name,
				cover: props.cover,
				description: props.description,
				url: props.url || null,
				npm: props.npm || null,
				github: props.github || null,
				status: isEmpty(props.status) ? 1 : props.status,
				order: props.order || 0,
				source,
				user
			})
			await this.minuteModel.save(newMinute)

			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**修改收录-授权管理端**/
	public async nodeUpdateMinute(props: DTO.NodeUpdateMinuteParameter, uid: number) {
		try {
			const minute = await this.minuteModel.findOne({ where: { id: props.id }, relations: ['source'] })
			if (!minute) {
				throw new HttpException('收录不存在', HttpStatus.BAD_REQUEST)
			}

			if (props.source?.length > 0) {
				const source = await this.sourceModel.find({ where: { id: In(props.source) } })
				props.source.forEach(id => {
					const element = source.find(element => element.id === id)
					if (!element) {
						throw new HttpException(`标签id ${id} 不存在`, HttpStatus.BAD_REQUEST)
					} else if (element?.status === 0) {
						throw new HttpException(`标签 ${element.name} 已禁用`, HttpStatus.BAD_REQUEST)
					} else if (element?.status === 2) {
						throw new HttpException(`标签 ${element.name} 已删除`, HttpStatus.BAD_REQUEST)
					}
				})
			}

			//删除已有的标签
			await this.minuteModel
				.createQueryBuilder()
				.relation('source')
				.of(minute)
				.addAndRemove(
					props.source,
					minute.source.map(k => k.id)
				)

			await this.minuteModel.update(
				{ id: props.id },
				{
					name: props.name,
					cover: props.cover,
					description: props.description,
					url: props.url || null,
					npm: props.npm || null,
					github: props.github || null,
					status: isEmpty(props.status) ? minute.status : props.status,
					order: props.order || 0
				}
			)

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**切换收录状态-授权管理端**/
	public async nodeMinuteCutover(props: DTO.NodeMinuteCutoverParameter) {
		try {
			const minute = await this.minuteModel.findOne({ where: { id: props.id } })
			if (!minute) {
				throw new HttpException('收录不存在', HttpStatus.BAD_REQUEST)
			} else if (minute.status === 2) {
				throw new HttpException('收录已删除', HttpStatus.BAD_REQUEST)
			}
			await this.minuteModel.update(
				{ id: props.id },
				{
					status: minute.status ? 0 : 1
				}
			)

			return { message: '修改成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**收录信息-授权管理端**/
	public async nodeMinute(props: DTO.NodeMinuteParameter) {
		try {
			const minute = await this.minuteModel.findOne({
				where: { id: props.id },
				relations: ['source', 'user']
			})
			if (!minute) {
				throw new HttpException('收录不存在', HttpStatus.BAD_REQUEST)
			}
			return minute
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**收录信息-客户端**/
	public async nodeClientMinute(props: DTO.NodeMinuteParameter) {
		try {
			const minute = await this.minuteModel.findOne({
				where: { id: props.id },
				relations: ['source', 'user']
			})
			if (!minute) {
				throw new HttpException('收录不存在', HttpStatus.BAD_REQUEST)
			} else if (minute.status === 0) {
				throw new HttpException('收录已禁用', HttpStatus.BAD_REQUEST)
			} else if (minute.status === 2) {
				throw new HttpException('收录已删除', HttpStatus.BAD_REQUEST)
			}

			return minute
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**收录列表-授权管理端**/
	public async nodeMinutes(props: DTO.NodeMinutesParameter, uid: number) {
		try {
			const [list = [], total = 0] = await this.minuteModel
				.createQueryBuilder('minute')
				.leftJoinAndSelect('minute.source', 'source')
				.leftJoinAndSelect('minute.user', 'user')
				.where(
					new Brackets(Q => {
						Q.where('user.uid = :uid', { uid })

						if (isEmpty(props.status)) {
							Q.andWhere('minute.status != :status', { status: 2 })
						} else {
							Q.andWhere('minute.status = :status', { status: props.status })
						}

						if (props.name) {
							Q.andWhere('minute.name LIKE :name', { name: `%${props.name}%` })
						}

						if (props.source) {
							Q.andWhere('source.id = :source', { source: props.source })
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

	/**收录列表-客户端**/
	public async nodeClientMinutes(props: DTO.NodeClientMinutesParameter) {
		try {
			const [list = [], total = 0] = await this.minuteModel
				.createQueryBuilder('minute')
				.leftJoinAndSelect('minute.source', 'source')
				.leftJoinAndSelect('minute.user', 'user')
				.where(
					new Brackets(Q => {
						Q.andWhere('minute.status = :status', { status: 1 })

						if (props.name) {
							Q.andWhere('minute.name LIKE :name', { name: `%${props.name}%` })
						}

						if (props.source) {
							Q.andWhere('source.id = :source', { source: props.source })
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

	/**删除收录-授权管理端**/
	public async nodeDeleteMinute(props: DTO.NodeDeleteMinuteParameter) {
		try {
			const minute = await this.minuteModel.findOne({ where: { id: props.id } })
			if (!minute) {
				throw new HttpException('收录不存在', HttpStatus.BAD_REQUEST)
			} else if (minute.status === 2) {
				throw new HttpException('收录已删除', HttpStatus.BAD_REQUEST)
			}
			await this.minuteModel.update({ id: props.id }, { status: 2 })

			return { message: '删除成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
