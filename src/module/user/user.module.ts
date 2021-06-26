import { Module, Global } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '@/entity/user.entity'
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	providers: [UserService],
	controllers: [UserController],
	exports: [UserService]
})
export class UserModule {}
