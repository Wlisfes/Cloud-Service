import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'
import { Any, getRepository } from 'typeorm'
import { LoggerEntity } from '@/entity/logger.entity'
import { APP_AUTH_TOKEN } from '@/guard/auth.guard'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	async use(req: Request, res: Response, next: () => void) {
		const node = await getRepository(LoggerEntity).create({
			referer: req.headers.referer,
			ip: req.ip,
			path: req.url,
			method: req.method,
			body: req.body,
			query: req.query as any,
			params: req.params as any,
			code: res.statusCode,
			message: '中间件存储'
		})
		await getRepository(LoggerEntity).save(node)
		next()
	}
}
