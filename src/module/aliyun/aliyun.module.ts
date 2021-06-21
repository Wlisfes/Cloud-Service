import { Module, DynamicModule } from '@nestjs/common'
import { CLIENT_CONFIG, Config, aliyunProvider } from './aliyun.provider'
import { AliyunService } from './aliyun.service'
import { AliyunController } from './aliyun.controller'

@Module({
	controllers: [AliyunController]
})
export class AliyunModule {
	public static forRoot(options: Config): DynamicModule {
		return {
			module: AliyunModule,
			providers: [aliyunProvider(), { provide: CLIENT_CONFIG, useValue: options }, AliyunService],
			exports: [AliyunService]
		}
	}
}
