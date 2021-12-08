import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Brackets, getManager } from 'typeorm'
import { CloudEntity } from '@/entity/cloud.entity'
import { ArticleEntity } from '@/entity/article.entity'
import { MinuteEntity } from '@/entity/minute.entity'
import { SourceEntity } from '@/entity/source.entity'
import { UserEntity } from '@/entity/user.entity'
import { LoggerEntity } from '@/entity/logger.entity'
import * as DTO from './compute.interface'
import * as day from 'dayjs'

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

	/**查询各类时间段数据**/
	public async nodeComputeGroup(props: DTO.NodeComputeGroupParameter) {
		try {
			const table = { 1: 'cloud', 2: 'article', 3: 'source', 4: 'minute', 5: 'user' }
			const currTime = day().format('YYYY-MM-DD HH:mm:ss')
			const prevTime = day()
				.add(-1, 'year')
				.format('YYYY-MM-DD HH:mm:ss')

			const month = Object.keys([...Array(12)]).map((_, index) => {
				return day()
					.add(-index, 'month')
					.format('YYYY-MM')
			})

			const list: Array<{ month: string; total: string }> = await getManager().query(
				`SELECT DATE_FORMAT(t.createTime,'%Y/%m') AS month,
			    count(1) AS total FROM ${table[props.current]} AS t
			    WHERE createTime >= '${prevTime}' AND createTime <= '${currTime}'
			    GROUP BY month`
			)

			return {
				list: month.map(item => {
					const curr = list.find(k => k.month === item) || null
					return {
						key: item,
						value: Number(curr?.total || 0)
					}
				})
			}
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
