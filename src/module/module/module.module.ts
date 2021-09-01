import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ModuleController } from './module.controller'
import { ModuleService } from './module.service'
import { ModuleEntity } from '@/entity/module.entity'
import { ModuleActionEntity } from '@/entity/module.action.entity'

@Module({
	imports: [TypeOrmModule.forFeature([ModuleEntity, ModuleActionEntity])],
	controllers: [ModuleController],
	providers: [ModuleService]
})
export class ModuleModule {}
