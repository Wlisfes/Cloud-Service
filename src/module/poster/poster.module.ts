import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PosterController } from './poster.controller'
import { PosterService } from './poster.service'
import { UserEntity } from '@/entity/user.entity'
import { PosterEntity } from '@/entity/poster.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, PosterEntity])],
	controllers: [PosterController],
	providers: [PosterService]
})
export class PosterModule {}
