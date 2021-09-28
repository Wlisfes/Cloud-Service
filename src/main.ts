import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { LoggerMiddleware } from '@/middleware/logger/logger.middleware'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { HttpExceptionFilter } from '@/filters/http-exception.filter'
import { TransformInterceptor } from '@/interceptor/transform.interceptor'
import { AppModule } from '@/app.module'
import { APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as express from 'express'

export async function webSwagger(app) {
	const options = new DocumentBuilder()
		.setTitle('Cloud-Service')
		.setDescription('Cloud-Service Api Documentation')
		.setVersion('1.0')
		.addBearerAuth({ type: 'apiKey', name: APP_AUTH_TOKEN, in: 'header' }, APP_AUTH_TOKEN)
		.build()
	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup('api-doc', app, document)
	return this
}

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		cors: true
	})

	//解析body参数
	app.use(express.json()) // For parsing application/json
	app.use(express.urlencoded({ extended: true }))

	//接口前缀
	app.setGlobalPrefix('/api')

	//文档挂载
	await webSwagger(app)

	//全局注册验证管道
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true
		})
	)

	//注册全局中间件
	app.use(new LoggerMiddleware().use)

	//全局注册错误的过滤器
	app.useGlobalFilters(new HttpExceptionFilter())

	//全局注册拦截器更改返回数据格式
	app.useGlobalInterceptors(new TransformInterceptor())

	const port = process.env.PORT || 3005
	await app.listen(port)
	console.log(`http://localhost:${port}`)
	console.log(`http://localhost:${port}/api-doc`)
}
bootstrap()
