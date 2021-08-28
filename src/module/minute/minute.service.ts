import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In, Not, Like, Brackets } from 'typeorm'
import { MinuteEntity } from '@/entity/minute.entity'
import { UserEntity } from '@/entity/user.entity'
import { SourceEntity } from '@/entity/source.entity'

@Injectable()
export class MinuteService {
	constructor(
		@InjectRepository(MinuteEntity) private readonly minuteModel: Repository<MinuteEntity>,
		@InjectRepository(SourceEntity) private readonly sourceModel: Repository<SourceEntity>,
		@InjectRepository(UserEntity) private readonly userModel: Repository<UserEntity>
	) {}
}
