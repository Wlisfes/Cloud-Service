import { Module, Global } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
	providers: [UserService],
	controllers: [UserController],
	exports: [UserService]
})
export class UserModule {}
