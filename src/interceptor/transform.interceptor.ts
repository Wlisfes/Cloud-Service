import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpStatus } from '@nestjs/common'
import { LoggerService } from '@/module/logger/logger.service'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'
import * as day from 'dayjs'

interface MapResult<T> {
	data: T
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, MapResult<T>> {
	constructor(private readonly loggerService: LoggerService) {}

	async intercept(context: ExecutionContext, next: CallHandler<T>): Promise<Observable<MapResult<T>>> {
		try {
			const [req, res] = context.getArgs()
			await this.loggerService.nodeCreateLogger(
				{
					referer: req.headers.referer,
					ip: req.ipv4,
					path: req.url,
					method: req.method,
					body: req.body,
					query: req.query,
					params: req.params,
					code: res.statusCode,
					type: 1,
					status: 1,
					message: '请求成功',
					id: 0,
					page: 0,
					size: 0
				},
				req.user?.uid
			)
		} catch (e) {}

		return next.handle().pipe(
			map(data => {
				return {
					data: data || null,
					code: HttpStatus.OK,
					message: '请求成功',
					timestamp: day().format('YYYY-MM-DD HH:mm:ss')
				}
			})
		)
	}
}
