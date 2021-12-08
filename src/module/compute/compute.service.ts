import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Brackets } from 'typeorm'
import { CloudEntity } from '@/entity/cloud.entity'
import { ArticleEntity } from '@/entity/article.entity'
import { MinuteEntity } from '@/entity/minute.entity'
import { SourceEntity } from '@/entity/source.entity'
import { UserEntity } from '@/entity/user.entity'
import { LoggerEntity } from '@/entity/logger.entity'

@Injectable()
export class ComputeService {
	constructor(
		@InjectRepository(CloudEntity) private readonly cloudModel: Repository<CloudEntity>,
		@InjectRepository(ArticleEntity) private readonly articleModel: Repository<ArticleEntity>,
		@InjectRepository(MinuteEntity) private readonly minuteModel: Repository<MinuteEntity>,
		@InjectRepository(SourceEntity) private readonly sourceModel: Repository<SourceEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>,
		@InjectRepository(LoggerEntity) private readonly loggerModel: Repository<LoggerEntity>
	) {}

	/**各类总数统计**/
	public async nodeComputeTotal() {
		try {
			const user = await this.userModel.createQueryBuilder().getCount()
			const cloud = await this.cloudModel.createQueryBuilder().getCount()
			const article = await this.articleModel.createQueryBuilder().getCount()
			const minute = await this.minuteModel.createQueryBuilder().getCount()
			const source = await this.sourceModel.createQueryBuilder().getCount()

			return { user, cloud, article, minute, source }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
