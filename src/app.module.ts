import { Module } from '@nestjs/common'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'

//守卫
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from '@/guard/auth.guard'

//全局依赖模块
import { TypeOrmModule } from '@nestjs/typeorm'
import { InitModule } from '@/module/init/init.module'

//表注入
import { UserEntity } from '@/entity/user.entity'
import { RoleEntity } from '@/entity/role.entity'
import { AuthEntity } from '@/entity/auth.entity'
import { ActionEntity } from '@/entity/action.entity'
import { MenuEntity } from '@/entity/menu.entity'

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, AuthEntity, ActionEntity, MenuEntity]), InitModule],
	controllers: [AppController],
	providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard }]
})
export class AppModule {}
