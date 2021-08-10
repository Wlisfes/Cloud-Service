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
import { MenuEntity } from '@/entity/menu.entity'
import { CloudEntity } from '@/entity/cloud.entity'
import { CloudSourceEntity } from '@/entity/cloud.source.entity'
import { SourceEntity } from '@/entity/source.entity'
import { ArticleEntity } from '@/entity/article.entity'

@Module({
	imports: [
		TypeOrmModule.forRoot({
			extra: {
				poolMax: 32,
				poolMin: 16,
				queueTimeout: 60000,
				pollPingInterval: 60, // 每隔60秒连接
				pollTimeout: 60 // 连接有效60秒
			}
		}),
		TypeOrmModule.forFeature([
			UserEntity,
			RoleEntity,
			MenuEntity,
			CloudEntity,
			CloudSourceEntity,
			SourceEntity,
			ArticleEntity
		]),
		InitModule
	],
	controllers: [AppController],
	providers: [AppService, { provide: APP_GUARD, useClass: AuthGuard }]
})
export class AppModule {}
