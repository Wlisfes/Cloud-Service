import { Module } from '@nestjs/common'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core'
import { TransformInterceptor } from '@/interceptor/transform.interceptor'
import { HttpExceptionFilter } from '@/filters/http-exception.filter'

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
import { MinuteEntity } from '@/entity/minute.entity'
import { ModuleEntity } from '@/entity/module.entity'
import { ModuleActionEntity } from '@/entity/module.action.entity'
import { PosterEntity } from '@/entity/poster.entity'
import { PartnerEntity } from '@/entity/partner.entity'
import { LoggerEntity } from '@/entity/logger.entity'

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
			ArticleEntity,
			MinuteEntity,
			ModuleEntity,
			ModuleActionEntity,
			PosterEntity,
			PartnerEntity,
			LoggerEntity
		]),
		InitModule
	],
	controllers: [AppController],
	providers: [
		AppService,
		{ provide: APP_GUARD, useClass: AuthGuard },
		{
			provide: APP_INTERCEPTOR,
			useClass: TransformInterceptor
		},
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter
		}
	]
})
export class AppModule {}
