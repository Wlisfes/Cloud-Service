import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CloudEntity } from '@/entity/cloud.entity'
import { CloudSourceEntity } from '@/entity/cloud.source.entity'

@Injectable()
export class CloudService {
	constructor(
		@InjectRepository(CloudEntity) private readonly cloudModel: Repository<CloudEntity>,
		@InjectRepository(CloudSourceEntity) private readonly sourceModel: Repository<CloudSourceEntity>
	) {}
}
