import { Module } from '@nestjs/common'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'

//全局依赖模块
import { TypeOrmModule } from '@nestjs/typeorm'
import { InitModule } from '@/common/init/init.module'
import { WebInitModule } from '@/web-module/init/init.module'

//表注入
import { UserEntity } from '@/entity/user.entity'

@Module({
	imports: [InitModule, TypeOrmModule.forFeature([UserEntity]), WebInitModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
