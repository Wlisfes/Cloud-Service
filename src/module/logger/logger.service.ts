import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Brackets } from 'typeorm'
import { isEmpty } from 'class-validator'
import { UserEntity } from '@/entity/user.entity'
import { LoggerEntity } from '@/entity/logger.entity'
import * as DTO from './logger.interface'

@Injectable()
export class LoggerService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(LoggerEntity) private readonly loggerModel: Repository<LoggerEntity>
	) {}

	/**创建Logger**/
	public async nodeCreateLogger(props: DTO.NodeCreateLoggerParameter, uid?: number) {
		try {
			if (!props.path.includes('logger')) {
				const node = await this.loggerModel.create({
					referer: props.referer,
					ip: props.ip,
					path: props.path,
					method: props.method,
					body: props.body,
					query: props.query,
					params: props.params,
					code: props.code,
					message: props.message,
					type: props.type,
					status: props.status,
					user: await this.userModel.findOne({ where: { uid } })
				})
				await this.loggerModel.save(node)
			}

			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**切换Logger状态-授权管理端**/
	public async nodeLoggerCutover(props: DTO.NodeLoggerCutoverParameter) {
		try {
			const node = await this.loggerModel.findOne({ where: { id: props.id } })
			if (!node) {
				throw new HttpException('logger不存在', HttpStatus.BAD_REQUEST)
			} else if (node.status === 2) {
				throw new HttpException('logger已删除', HttpStatus.BAD_REQUEST)
			}
			await this.loggerModel.update(
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

	/**Logger信息-授权管理端**/
	public async nodeLogger(props: DTO.NodeLoggerParameter) {
		try {
			const node = await this.loggerModel.findOne({ where: { id: props.id }, relations: ['user'] })
			if (!node) {
				throw new HttpException('logger不存在', HttpStatus.BAD_REQUEST)
			} else if (node.status === 2) {
				throw new HttpException('logger已删除', HttpStatus.BAD_REQUEST)
			}

			return node
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**Logger列表-授权管理端**/
	public async nodeLoggers(props: DTO.NodeLoggersParameter) {
		try {
			const [list = [], total = 0] = await this.loggerModel
				.createQueryBuilder('logger')
				.leftJoinAndSelect('logger.user', 'user')
				.where(
					new Brackets(Q => {
						if (!isEmpty(props.type)) {
							Q.andWhere('logger.type = :type', { type: props.type })
						}

						if (isEmpty(props.status)) {
							Q.andWhere('logger.status = :status', { status: 1 })
						} else {
							Q.andWhere('logger.status = :status', { status: props.status })
						}
					})
				)
				.orderBy({ 'logger.createTime': 'DESC' })
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

	/**删除Logger-授权管理端**/
	public async nodeDeleteLogger(props: DTO.NodeDeleteLoggerParameter) {
		try {
			const node = await this.loggerModel.findOne({ where: { id: props.id } })
			if (!node) {
				throw new HttpException('logger不存在', HttpStatus.BAD_REQUEST)
			} else if (node.status === 2) {
				throw new HttpException('logger已删除', HttpStatus.BAD_REQUEST)
			}
			await this.loggerModel.update(
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
