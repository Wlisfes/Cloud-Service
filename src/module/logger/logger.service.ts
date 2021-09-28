import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { isEmpty } from 'class-validator'
import { UserEntity } from '@/entity/user.entity'
import { LoggerEntity } from '@/entity/logger.entity'

@Injectable()
export class LoggerService {
	constructor(
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(LoggerEntity) private readonly loggerModel: Repository<LoggerEntity>
	) {}

	/**创建logger**/
	public async nodeCreateLogger() {
		try {
			return { message: '创建成功' }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
