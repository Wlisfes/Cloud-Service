import { Module, Global, DynamicModule } from '@nestjs/common'
import { RedisService } from './redis.service'
import { REDIS_OPTIONS } from './redis.provider'
import { RedisOptions } from 'ioredis'

@Global()
@Module({
	providers: [RedisService]
})
export class RedisModule {
	static forRoot(options: RedisOptions): DynamicModule {
		return {
			module: RedisModule,
			providers: [{ provide: REDIS_OPTIONS, useValue: options }, RedisService],
			exports: [RedisService]
		}
	}
}
