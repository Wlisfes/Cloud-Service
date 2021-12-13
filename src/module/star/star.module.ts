import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StarController } from './star.controller'
import { StarService } from './star.service'
import { UserEntity } from '@/entity/user.entity'
import { StarEntity } from '@/entity/user.star.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, StarEntity])],
	controllers: [StarController],
	providers: [StarService],
	exports: [StarService]
})
export class StarModule {}
