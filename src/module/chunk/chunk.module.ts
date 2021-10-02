import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChunkController } from './chunk.controller'
import { ChunkService } from './chunk.service'
import { UserEntity } from '@/entity/user.entity'
import { ChunkEntity } from '@/entity/chunk.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, ChunkEntity])],
	controllers: [ChunkController],
	providers: [ChunkService]
})
export class ChunkModule {}
