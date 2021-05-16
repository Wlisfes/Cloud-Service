import { Module, Global } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { BannerModule } from '@/web-module/banner/banner.module'

@Global()
@Module({
	imports: [BannerModule]
})
export class WebInitModule {}

export async function webSwagger(app) {
	const options = new DocumentBuilder()
		.setTitle('博客系统B端Api')
		.setDescription('博客系统B端Api文档')
		.setVersion('1.0')
		.build()
	const document = SwaggerModule.createDocument(app, options, {
		include: [BannerModule]
	})
	SwaggerModule.setup('api-web', app, document)
	return this
}
