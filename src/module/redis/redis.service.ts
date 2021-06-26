import { Injectable, Inject } from '@nestjs/common'
import { REDIS_OPTIONS } from './redis.provider'
import * as Redis from 'ioredis'

@Injectable()
export class RedisService {
	protected client: Redis.Redis
	protected observer: Redis.Redis

	constructor(@Inject(REDIS_OPTIONS) public readonly options: Redis.RedisOptions) {
		this.client = new Redis(options)
	}

	//存储
	public async setStore(key: string, data: any, seconds?: number) {
		if (!seconds) {
			return await this.client.set(key, JSON.stringify(data))
		} else {
			return await this.client.set(key, JSON.stringify(data), 'EX', seconds)
		}
	}

	//读取
	public async getStore(key: string) {
		const data = await this.client.get(key)
		if (data) {
			return JSON.parse(data)
		} else {
			return null
		}
	}
}
