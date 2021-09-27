import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PartnerController } from './partner.controller'
import { PartnerService } from './partner.service'
import { PartnerEntity } from '@/entity/partner.entity'
import { PosterEntity } from '@/entity/poster.entity'

@Module({
	imports: [TypeOrmModule.forFeature([PosterEntity, PartnerEntity])],
	controllers: [PartnerController],
	providers: [PartnerService]
})
export class PartnerModule {}
