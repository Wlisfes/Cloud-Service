import { Module, HttpModule } from '@nestjs/common'
import { BannerService } from './banner.service'
import { BannerController } from './banner.controller'

@Module({
	imports: [HttpModule],
	providers: [BannerService],
	controllers: [BannerController]
})
export class BannerModule {}
