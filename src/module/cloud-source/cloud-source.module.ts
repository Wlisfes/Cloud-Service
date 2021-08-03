import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CloudSourceService } from './cloud-source.service'
import { CloudSourceController } from './cloud-source.controller'
import { CloudEntity } from '@/entity/cloud.entity'
import { CloudSourceEntity } from '@/entity/cloud.source.entity'

@Module({
	imports: [TypeOrmModule.forFeature([CloudEntity, CloudSourceEntity])],
	providers: [CloudSourceService],
	controllers: [CloudSourceController]
})
export class CloudSourceModule {}
