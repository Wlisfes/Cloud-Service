import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SourceService } from './source.service'
import { SourceController } from './source.controller'
import { SourceEntity } from '@/entity/source.entity'

@Module({
	imports: [TypeOrmModule.forFeature([SourceEntity])],
	providers: [SourceService],
	controllers: [SourceController]
})
export class SourceModule {}
