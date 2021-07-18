import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

/**转码模板组数据列表**/
class TemplateGroupList {
	@ApiProperty({ description: '应用ID', example: 'app-****' })
	AppId: string
	@ApiProperty({ description: '模板组的创建时间', example: '2021-04-23 16:04:12' })
	CreationTime: string
	@ApiProperty({ description: '模板组的修改时间', example: '2021-04-23 16:04:12' })
	ModifyTime: string
	@ApiProperty({ description: '是否是默认模板组', example: false })
	IsDefault: boolean
	@ApiProperty({ description: '转码模板组是否锁定状态', example: false })
	Locked: boolean
	@ApiProperty({ description: '模板组的名称', example: '超清-HD' })
	Name: string
	@ApiProperty({ description: '转码模板组ID', example: '17a9889fc66852*****d791c886700932' })
	TranscodeTemplateGroupId: string
}

/**分类数据列表**/
class SourceGroupList {
	@ApiProperty({ description: '父分类ID。一级分类父ID为-1', example: -1 })
	ParentId: number
	@ApiProperty({ description: '分类层级,一级分类层级为0', example: 0 })
	Level: number
	@ApiProperty({ description: '视频分类ID', example: 1000318239 })
	CateId: number
	@ApiProperty({ description: '分类名称', example: '分类名称' })
	CateName: string
	@ApiProperty({ description: '子分类总数', example: 0 })
	SubTotal: number
	@ApiProperty({ description: '分类类型 default:默认分类; material:素材分类', example: 'default' })
	Type: string
}

/**视频Meta信息**/
class VideoMeta {
	@ApiProperty({ description: '视频封面', example: 'https://image.example.com/****.jpg' })
	CoverURL: string
	@ApiProperty({ description: '视频ID', example: '770cbc3fbeb04e32b1640b1bc9*****' })
	VideoId: string
	@ApiProperty({ description: '视频标题', example: '视频标题' })
	Title: string
	@ApiProperty({ description: '视频时长。单位：秒。', example: 120.0 })
	Duration: number
	@ApiProperty({ description: '状态 Uploading-上传中; Normal-正常; UploadFail-失败', example: 'Normal' })
	Status: string
}

/**视频基本信息**/
class VideoBase extends VideoMeta {
	@ApiProperty({ description: '视频创建时间', example: '2021-04-23 16:04:12' })
	CreationTime: string
	@ApiProperty({ description: '视频创建时间', example: '2021-04-23 16:04:12', enum: ['video', 'audio'] })
	MediaType: string
}
/**视频播放信息**/
class VideoPlayInfo extends PickType(VideoBase, ['Status', 'Duration']) {
	@ApiProperty({ description: '视频流类型', example: '2021-04-23 16:04:12', enum: ['video', 'audio'] })
	StreamType: string
	@ApiProperty({ description: '视频流帧率。单位：帧/每秒', example: '25' })
	Fps: string
	@ApiProperty({ description: '视频流大小.单位：Byte', example: 83974772 })
	Size: number
	@ApiProperty({
		description: '视频流清晰度定义',
		enum: ['LD：流畅', 'SD：标清', 'HD：高清', 'FHD：超清', 'OD：原画', '2K', '4K', 'SQ：普通音质', 'HQ：高音质']
	})
	Definition: string
	@ApiProperty({ description: '创建时间', example: '2021-04-26 16:04:12' })
	CreationTime: string
	@ApiProperty({ description: '更新时间', example: '2021-04-26 16:04:12' })
	ModificationTime: string
	@ApiProperty({ description: '音视频转码输出规格', example: 'H264.LD' })
	Specification: string
	@ApiProperty({ description: '视频流码率。单位：Kbps', example: 3155.063 })
	Bitrate: string
	@ApiProperty({ description: '视频流是否加密流', example: 0, enum: ['0：否', '1：是'] })
	Encrypt: string
	@ApiProperty({ description: '' })
	PreprocessStatus: string
	@ApiProperty({ description: '视频流格式。若是纯音频则取值：mp3', enum: ['mp4', 'm3u8', 'mp3'] })
	Format: string
	@ApiProperty({ description: '视频流的播放地址', example: 'http://vod.aliyunsample.com/***' })
	PlayURL: string
	@ApiProperty({ description: '窄带高清类型', example: 0, enum: ['0：普通', '1.0：窄带高清1.0', '2.0：窄带高清2.0'] })
	NarrowBandType: string
	@ApiProperty({ description: '视频流高度。单位：px', example: 1080 })
	Height: number
	@ApiProperty({ description: '视频流宽度。单位：px', example: 1920 })
	Width: number
	@ApiProperty({
		description: '媒体流转码的作业ID。作为媒体流的唯一标识。',
		example: 'fd1c76fc806b*****194405528706d29'
	})
	JobId: string
}

class AliyunInterface {
	@ApiProperty({ description: '视频ID', example: '770cbc3fbeb04e32b1640b1bc9250387' })
	VideoId: string
	@ApiProperty({ description: '上传地址', example: 'eyJFbmRwb2ludCI6Imh0dHBzOi8vb3NzL...******' })
	UploadAddress: string
	@ApiProperty({ description: '请求ID', example: '9EB5A6B4-BE08-49E3-B4C0-4A141209D4E7' })
	RequestId: string
	@ApiProperty({ description: '上传凭证', example: 'eyJTZWN1cml0eVRva2VuIjoiQ0FJUzBB...******' })
	UploadAuth: string
	@ApiProperty({ description: '列表总数', example: 0 })
	SubTotal: number
	@ApiProperty({ description: '视频播放凭证', example: 'sstyYuew6789*****00000xtt7TYUh' })
	PlayAuth: string
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

	@ApiPropertyOptional({ description: '视频封面', example: 'https://oss.lisfes.cn/xxx.png' })
	CoverURL?: string

	@ApiPropertyOptional({ description: '视频描述' })
	Description?: string

	@ApiPropertyOptional({ description: '视频文件大小。单位：字节。' })
	FileSize?: number

	@ApiPropertyOptional({
		description: '视频标签,最多不超过16个标签,如需传入多个视频标签，请使用英文逗号分隔'
	})
	Tags?: string

	@ApiProperty({ description: '转码模板组ID' })
	TemplateGroupId: string

	@ApiPropertyOptional({
		description: '工作流ID,如果同时传递了WorkflowId和TemplateGroupId,以WorkflowId为准'
	})
	WorkflowId?: string

	/**---华丽的分割线-------------------------------------------------------------------------**/

	@ApiProperty({ description: '视频id', example: 'c701f4f45fdb411db614037f69bba11c' })
	@IsNotEmpty({ message: '视频id 必填' })
	@Type(() => String)
	VideoId: string

	/**---华丽的分割线-------------------------------------------------------------------------**/
	@ApiProperty({ description: '播放凭证过期时间, 取值范围100~3000', example: 100 })
	@IsNotEmpty({ message: '播放凭证过期时间 必填' })
	@IsNumber({}, { message: 'AuthInfoTimeout必须是数字' })
	@Min(100, { message: 'AuthInfoTimeout不能小于100' })
	@Type(() => Number)
	AuthInfoTimeout: number

	/**---华丽的分割线-------------------------------------------------------------------------**/
	@ApiProperty({ description: '播放地址过期时间。单位：秒, 最大值: 2592000 (即30天)', example: 1800 })
	@IsNotEmpty({ message: '播放凭证过期时间 必填' })
	@IsNumber({}, { message: 'AuthTimeout必须是数字' })
	@Min(100, { message: 'AuthTimeout不能小于100' })
	@Type(() => Number)
	AuthTimeout: number

	/**---华丽的分割线-------------------------------------------------------------------------**/
	@ApiProperty({ description: '分类ID。默认为根节点分类ID，即-1', example: '-1' })
	@IsOptional()
	CateId: string
}

/**创建上传凭证--Parameter**/
export class NodeCreateParameter extends PickType(AliyunParameter, [
	'Title',
	'FileName',
	'CoverURL',
	'Description',
	'FileSize',
	'Tags',
	'TemplateGroupId',
	'WorkflowId'
]) {}
/**创建上传凭证--Response**/
export class NodeCreateResponse extends PickType(AliyunInterface, [
	'RequestId',
	'UploadAddress',
	'UploadAuth',
	'VideoId'
]) {}

/**刷新上传凭证--Parameter**/
export class NodeRefreshParameter extends PickType(AliyunParameter, ['VideoId']) {}
/**刷新上传凭证--Response**/
export class NodeRefreshResponse extends NodeCreateResponse {}

/**获取转码模板列表--Response**/
export class NodeTransferResponse extends PickType(AliyunInterface, ['RequestId']) {
	@ApiProperty({ description: '模板组列表', type: [TemplateGroupList], example: [] })
	list: TemplateGroupList[]
}

/**获取分类列表--Parameter**/
export class NodeSourceParameter extends PickType(AliyunParameter, ['CateId']) {}
/**获取分类列表--Response**/
export class NodeSourceResponse extends PickType(AliyunInterface, ['RequestId', 'SubTotal']) {
	@ApiProperty({ description: '分类数据列表', type: [SourceGroupList], example: [] })
	list: SourceGroupList[]
}

/**获取播放凭证--Parameter**/
export class CreatePlayAuth extends PickType(AliyunParameter, ['VideoId', 'AuthInfoTimeout']) {}
/**获取播放凭证--Response**/
export class AliyunCreatePlayAuthResponse extends PickType(AliyunInterface, ['RequestId', 'PlayAuth']) {
	@ApiProperty({ description: '视频Meta信息', type: VideoMeta })
	props: VideoMeta
}

/**获取播放信息--Parameter**/
export class CreatePlayInfo extends PickType(AliyunParameter, ['VideoId', 'AuthTimeout']) {}
/**获取播放信息--Response**/
export class AliyunCreatePlayInfoResponse extends PickType(AliyunInterface, ['RequestId']) {
	@ApiProperty({ description: '视频基本信息', type: VideoBase })
	base: VideoBase
	@ApiProperty({ description: '视频播放信息列表', type: [VideoPlayInfo], example: [] })
	list: VideoPlayInfo[]
}

/**Oss******************************************************************************************************************/
class OssInterface {
	@ApiProperty({ description: 'Bucket所在地域', example: 'oss-cn-shenzhen.aliyuncs.com' })
	region: string
	@ApiProperty({ description: 'Bucket名称', example: 'linvc' })
	bucket: string
	@ApiProperty({ description: '临时accessKeyId', example: 'STS.CI6Imh0dHBzOi8vb3NzL...******' })
	accessKeyId: string
	@ApiProperty({ description: '临时accessKeySecret', example: 'I6Imh0dHBzOi8vb3NzL...******' })
	accessKeySecret: string
	@ApiProperty({ description: '临时stsToken', example: 'joiQ0FJUzBBsll09MKJD...******' })
	stsToken: string
	@ApiProperty({ description: 'oss加速域名', example: 'https://oss.lisfes.cn' })
	path: string
}

/**创建OssSTS授权-Response**************************************************/
export class NodeOssStsResponse extends PickType(OssInterface, [
	'accessKeyId',
	'accessKeySecret',
	'stsToken',
	'path'
]) {}
