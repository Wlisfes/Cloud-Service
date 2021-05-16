import { Module, Global } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'

import { WebInitModule } from '@/web-module/init/init.module'

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), WebInitModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
