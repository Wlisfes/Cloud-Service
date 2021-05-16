import { Module, HttpModule } from '@nestjs/common'
import { BannerService } from '@/web-module/banner/banner.service'
import { BannerController } from '@/web-module/banner/banner.controller'

@Module({
	imports: [HttpModule],
	providers: [BannerService],
	controllers: [BannerController]
})
export class BannerModule {}
