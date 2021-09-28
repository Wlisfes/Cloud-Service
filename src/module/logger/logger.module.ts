import { Module, Global } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoggerController } from './logger.controller'
import { LoggerService } from './logger.service'
import { UserEntity } from '@/entity/user.entity'
import { LoggerEntity } from '@/entity/logger.entity'

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, LoggerEntity])],
	controllers: [LoggerController],
	providers: [LoggerService],
	exports: [LoggerService]
})
export class LoggerModule {}
