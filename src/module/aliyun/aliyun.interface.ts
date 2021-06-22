import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

class AliyunInterface {
	@ApiProperty({ description: '视频ID', example: '770cbc3fbeb04e32b1640b1bc9250387' })
	VideoId: string

	@ApiProperty({ description: '上传地址', example: 'eyJFbmRwb2ludCI6Imh0dHBzOi8vb3NzL...******' })
	UploadAddress: string

	@ApiProperty({ description: '请求ID', example: '9EB5A6B4-BE08-49E3-B4C0-4A141209D4E7' })
	RequestId: string

	@ApiProperty({ description: '上传凭证', example: 'eyJTZWN1cml0eVRva2VuIjoiQ0FJUzBB...******' })
	UploadAuth: string
}
class AliyunParameter {
	@ApiProperty({ description: '视频标题', example: '妖雨纯' })
	@IsNotEmpty({ message: '视频标题 必填' })
	@Type(() => String)
	Title: string

	@ApiProperty({ description: '视频名称', example: '1624202595824.flv' })
	@IsNotEmpty({ message: '视频名称 必填' })
	@Type(() => String)
	FileName: string

	@ApiProperty({ description: '视频id', example: 'e182ea7c477d488faedcca60dfe0bfea' })
	@IsNotEmpty({ message: '视频id 必填' })
	@Type(() => String)
	VideoId: string

	@ApiProperty({ required: false, description: '视频封面', example: 'https://oss.lisfes.cn/xxx.png' })
	CoverURL?: string

	@ApiProperty({ required: false, description: '视频描述' })
	Description?: string

	@ApiProperty({ required: false, description: '视频文件大小。单位：字节。' })
	FileSize?: number

	@ApiProperty({
		required: false,
		description: '视频标签,最多不超过16个标签,如需传入多个视频标签，请使用英文逗号分隔'
	})
	Tags?: string

	@ApiProperty({ required: false, description: '转码模板组ID' })
	TemplateGroupId?: string

	@ApiProperty({
		required: false,
		description: '工作流ID,如果同时传递了WorkflowId和TemplateGroupId,以WorkflowId为准'
	})
	WorkflowId?: string
}

export class AliyunResponse extends PickType(AliyunInterface, [
	'RequestId',
	'UploadAddress',
	'UploadAuth',
	'VideoId'
]) {}

export class CreateUpload extends PickType(AliyunParameter, [
	'Title',
	'FileName',
	'CoverURL',
	'Description',
	'FileSize',
	'Tags',
	'TemplateGroupId',
	'WorkflowId'
]) {}

export class RefreshUpload extends PickType(AliyunParameter, ['VideoId']) {}
