import { ApiProperty, ApiPropertyOptional, PickType, IntersectionType } from '@nestjs/swagger'

export interface BingResponse {
	startdate: string
	enddate: string
	url: string
	copyright: string
	copyrightlink: string
}

export class BannerResponse {
	@ApiProperty({ description: '起始时间', example: '20210813' })
	start: string

	@ApiProperty({ description: '结束时间', example: '20210814' })
	end: string

	@ApiProperty({ description: '壁纸' })
	cover: string

	@ApiProperty({ description: '壁纸描述' })
	name: string

	@ApiProperty({ description: '壁纸搜索地址' })
	search: string
}

export class NodeBannerResponse {
	@ApiProperty({ description: '壁纸列表', type: [BannerResponse], example: [] })
	list: BannerResponse[]
}
