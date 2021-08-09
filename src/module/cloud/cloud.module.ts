import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CloudService } from './cloud.service'
import { CloudController } from './cloud.controller'
import { CloudEntity } from '@/entity/cloud.entity'
import { CloudSourceEntity } from '@/entity/cloud.source.entity'
import { UserEntity } from '@/entity/user.entity'

@Module({
	imports: [TypeOrmModule.forFeature([CloudEntity, CloudSourceEntity, UserEntity])],
	providers: [CloudService],
	controllers: [CloudController],
	exports: [CloudService]
})
export class CloudModule {}
