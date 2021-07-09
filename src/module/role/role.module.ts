import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'
import { AuthEntity } from '@/entity/auth.entity'
import { ActionEntity } from '@/entity/action.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, AuthEntity, ActionEntity])],
	providers: [RoleService],
	controllers: [RoleController]
})
export class RoleModule {}
