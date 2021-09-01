import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PosterEntity } from '@/entity/poster.entity'

@Injectable()
export class PosterService {
	constructor(@InjectRepository(PosterEntity) private readonly posterModel: Repository<PosterEntity>) {}
}
