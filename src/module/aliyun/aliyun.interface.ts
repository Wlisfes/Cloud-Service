import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

export class AliyunInterface {
	@ApiProperty({
		description: '视频ID',
		example: '770cbc3fbeb04e32b1640b1bc9250387'
	})
	VideoId: string

	@ApiProperty({
		description: '上传地址',
		example: 'eyJFbmRwb2ludCI6Imh0dHBzOi8vb3NzL...******'
	})
	UploadAddress: string

	@ApiProperty({
		description: '请求ID',
		example: '9EB5A6B4-BE08-49E3-B4C0-4A141209D4E7'
	})
	RequestId: string

	@ApiProperty({
		description: '上传凭证',
		example: 'eyJTZWN1cml0eVRva2VuIjoiQ0FJUzBB...******'
	})
	UploadAuth: string
}

export class CreateUpload {
	@ApiProperty({ description: '视频标题', example: '妖雨纯' })
	@IsNotEmpty({ message: '视频标题 必填' })
	@Type(() => String)
	Title: string

	@ApiProperty({ description: '视频名称', example: '1624202595824.flv' })
	@IsNotEmpty({ message: '视频名称 必填' })
	@Type(() => String)
	FileName: string

	@ApiProperty({ required: false, description: '视频封面', example: '//oss.lisfes.cn/xxx.png' })
	cover?: string
}

export class RefreshUpload {
	@ApiProperty({ description: '视频id', example: 'e182ea7c477d488faedcca60dfe0bfea' })
	@IsNotEmpty({ message: '视频id 必填' })
	@Type(() => String)
	VideoId: string
}
