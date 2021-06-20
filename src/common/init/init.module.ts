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
			accessKeyId: 'LTAI4GCnkFG1dVosYiJAyHaM',
			accessKeySecret: '9BAntvWrWdDMg8fRXBTPhBryj7l5aT',
			endpoint: 'http://vod.cn-shanghai.aliyuncs.com',
			apiVersion: '2017-03-21'
		})
	]
})
export class InitModule {}
