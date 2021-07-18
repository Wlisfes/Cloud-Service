import { Module, DynamicModule } from '@nestjs/common'
import { CLIENT_CONFIG, Config, OSS_OPTIONS, OSSOptions } from './aliyun.provider'
import { aliyunProvider, ossProvider, stsProvider } from './aliyun.provider'
import { AliyunService } from './aliyun.service'
import { AliyunController } from './aliyun.controller'

@Module({})
export class AliyunModule {
	public static forRoot(options: { aliyun: Config; oss: OSSOptions }): DynamicModule {
		return {
			module: AliyunModule,
			controllers: [AliyunController],
			providers: [
				aliyunProvider(),
				ossProvider(),
				stsProvider(),
				{ provide: CLIENT_CONFIG, useValue: options.aliyun },
				{ provide: OSS_OPTIONS, useValue: options.oss },
				AliyunService
			],
			exports: [AliyunService]
		}
	}
}
