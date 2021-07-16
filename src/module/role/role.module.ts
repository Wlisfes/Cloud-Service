import { Module, Global } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
	providers: [RoleService],
	controllers: [RoleController],
	exports: [RoleService]
})
export class RoleModule {}
