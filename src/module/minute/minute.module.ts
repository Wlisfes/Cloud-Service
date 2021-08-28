import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MinuteController } from './minute.controller'
import { MinuteService } from './minute.service'
import { MinuteEntity } from '@/entity/minute.entity'
import { UserEntity } from '@/entity/user.entity'
import { SourceEntity } from '@/entity/source.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, SourceEntity, MinuteEntity])],
	controllers: [MinuteController],
	providers: [MinuteService]
})
export class MinuteModule {}
