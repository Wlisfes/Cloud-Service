import { Module } from '@nestjs/common'
import { ComputeController } from './compute.controller'
import { ComputeService } from './compute.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CloudEntity } from '@/entity/cloud.entity'
import { ArticleEntity } from '@/entity/article.entity'
import { MinuteEntity } from '@/entity/minute.entity'
import { SourceEntity } from '@/entity/source.entity'
import { UserEntity } from '@/entity/user.entity'
import { LoggerEntity } from '@/entity/logger.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([CloudEntity, ArticleEntity, MinuteEntity, SourceEntity, UserEntity, LoggerEntity])
	],
	controllers: [ComputeController],
	providers: [ComputeService]
})
export class ComputeModule {}
