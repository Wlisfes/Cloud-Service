import { Module, Global } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AliyunModule } from '@/common/aliyun/aliyun.module'

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot(),
		AliyunModule.forRoot({
			accessKeyId: process.env.ALIYUN_ACCESSKEYID,
			accessKeySecret: process.env.ALIYUN_ACCESSKEYSECRET,
			endpoint: process.env.ALIYUN_ENDPOINT,
			apiVersion: process.env.ALIYUN_APIVERSION
		})
	]
})
export class InitModule {}
