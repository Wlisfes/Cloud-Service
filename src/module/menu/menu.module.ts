import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MenuService } from './menu.service'
import { MenuController } from './menu.controller'
import { UserEntity } from '@/entity/user.entity'
import { MenuEntity } from '@/entity/menu.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, MenuEntity])],
	providers: [MenuService],
	controllers: [MenuController]
})
export class MenuModule {}
