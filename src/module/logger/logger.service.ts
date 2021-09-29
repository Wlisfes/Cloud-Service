import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
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

	/**创建logger**/
	public async nodeCreateLogger(props: DTO.NodeCreateLoggerParameter, uid?: number) {
		try {
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
				status: props.status,
				user: await this.userModel.findOne({ where: { uid } })
			})
			await this.loggerModel.save(node)

			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
