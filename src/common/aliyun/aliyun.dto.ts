import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateUpload {
	@ApiProperty({ description: '视频标题', example: '妖雨纯' })
	@IsNotEmpty({ message: '视频标题 必填' })
	@Type(() => String)
	Title: string

	@ApiProperty({ description: '视频名称', example: '1624202595824.flv' })
	@IsNotEmpty({ message: '视频名称 必填' })
	@Type(() => String)
	FileName: string
}

export class RefreshUpload {
	@ApiProperty({ description: '视频id', example: 'VideoId' })
	@IsNotEmpty({ message: '视频id 必填' })
	@Type(() => String)
	VideoId: string
}
