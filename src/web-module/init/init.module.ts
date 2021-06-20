import { Module, Global } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

//依赖模块挂载
import { AliyunModule } from '@/common/aliyun/aliyun.module'
import { BannerModule } from '@/web-module/banner/banner.module'
import { UserModule } from '@/web-module/user/user.module'

const imports = [BannerModule, UserModule]
@Global()
@Module({
	imports: [...imports]
})
export class WebInitModule {}

export async function webSwagger(app) {
	const options = new DocumentBuilder()
		.setTitle('博客系统B端Api')
		.setDescription('博客系统B端Api文档')
		.setVersion('1.0')
		.build()
	const document = SwaggerModule.createDocument(app, options, {
		include: [AliyunModule, ...imports]
	})
	SwaggerModule.setup('api-web', app, document)
	return this
}
