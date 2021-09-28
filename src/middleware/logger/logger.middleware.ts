import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'
import { APP_AUTH_TOKEN } from '@/guard/auth.guard'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	async use(req: Request, res: Response, next: () => void) {
		const referer = req.headers.referer
		const token = req.headers[APP_AUTH_TOKEN]
		const params = req.params || {}
		const query = req.query || {}
		const body = req.body || {}
		const url = req.url
		const method = req.method
		const ip = req.ip
		console.log({
			originalUrl: req.originalUrl,
			code: res.statusCode,
			referer,
			token,
			params,
			query,
			body,
			url,
			method,
			ip
		})
		next()
	}
}
