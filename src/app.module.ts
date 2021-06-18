import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'

//全局依赖模块
import { TypeOrmModule } from '@nestjs/typeorm'
import { WebInitModule } from '@/web-module/init/init.module'

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), TypeOrmModule.forFeature([]), WebInitModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
