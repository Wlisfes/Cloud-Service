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
			const user = await this.nodeComputeMonthTotal(this.userModel)
			const cloud = await this.nodeComputeMonthTotal(this.cloudModel)
			const article = await this.nodeComputeMonthTotal(this.articleModel)
			const minute = await this.nodeComputeMonthTotal(this.minuteModel)
			const source = await this.nodeComputeMonthTotal(this.sourceModel)

			return { user, cloud, article, minute, source }
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}

	/**查询各类当月数据和总数**/
	public async nodeComputeMonthTotal<Entity>(model: Repository<Entity>) {
		try {
			const total = await model.createQueryBuilder().getCount()
			const count = await model
				.createQueryBuilder()
				.where(
					new Brackets(Q => {
						Q.andWhere('createTime BETWEEN :start AND :end', {
							start: `${day(new Date().setDate(1)).format('YYYY-MM-DD')} 00:00:00`,
							end: day().format('YYYY-MM-DD HH:mm:ss')
						})
					})
				)
				.getCount()

			return { total, count }
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

			const month = Object.keys([...Array(12)])
				.sort((a: any, b: any) => Number(b) - Number(a))
				.map(index =>
					day()
						.add(-index, 'month')
						.format('YYYY-MM')
				)

			const list: Array<{ month: string; total: string }> = await getManager().query(
				`SELECT DATE_FORMAT(t.createTime,'%Y-%m') AS month,
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
