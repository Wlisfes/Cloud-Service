import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CloudService } from './cloud.service'
import { CloudController } from './cloud.controller'
import { CloudEntity } from '@/entity/cloud.entity'
import { CloudSourceEntity } from '@/entity/cloud.source.entity'

@Module({
	imports: [TypeOrmModule.forFeature([CloudEntity, CloudSourceEntity])],
	providers: [CloudService],
	controllers: [CloudController]
})
export class CloudModule {}
