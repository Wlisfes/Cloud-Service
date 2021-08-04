import { ApiProperty, ApiPropertyOptional, PickType } from '@nestjs/swagger'
import { IsNotEmpty, IsHexColor, IsNumber, Min } from 'class-validator'
import { IsOptional } from '@/decorator/common.decorator'
import { Type } from 'class-transformer'

export class CloudResponse {
	@ApiProperty({ description: '媒体id', example: 1 })
	id: number

	@ApiProperty({ description: '类型: 1.单集媒体 2.多集媒体', enum: [1, 2], example: 1 })
	type: number

	@ApiProperty({ description: '媒体标题', example: '星河里的鲸' })
	title: string

	@ApiProperty({ description: '媒体存在阿里云视频点播的VideoId' })
	key: string

	@ApiProperty({ description: '媒体源存在阿里云视频点播的文件名' })
	name: string

	@ApiProperty({ description: '媒体源存在阿里云视频点播的文件地址' })
	path: string

	@ApiProperty({ description: '媒体封面' })
	cover: string

	@ApiProperty({ description: '媒体状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2], example: 1 })
	status: number

	@ApiProperty({ description: '排序号', example: 1 })
	order: number

	@ApiProperty({ description: '媒体描述' })
	description: string

	@ApiProperty({ description: '类型为多集媒体的父类' })
	parent: CloudResponse

	@ApiProperty({ description: '类型为多集媒体的子类', type: [CloudResponse], example: [] })
	children: CloudResponse[]

	@ApiPropertyOptional({ description: '总数', example: 0 })
	total: number

	@ApiProperty({ description: '分页', example: 1 })
	page: number

	@ApiProperty({ description: '分页数量', example: 10 })
	size: number
}

export class CloudParameter {
	@ApiProperty({ description: '媒体id', example: 1 })
	@IsNotEmpty({ message: '媒体id 必填' })
	@Type(type => Number)
	id: number

	@ApiProperty({ description: '媒体类型: 1.单集媒体 2.多集媒体', enum: [1, 2], example: 1 })
	@IsNotEmpty({ message: '媒体类型 必填' })
	@Type(type => Number)
	type: number

	@ApiProperty({ description: '媒体标题', example: '星河里的鲸' })
	@IsNotEmpty({ message: '媒体标题 必填' })
	title: string

	@ApiPropertyOptional({ description: '媒体存在阿里云视频点播的VideoId' })
	@IsOptional({}, { string: true, number: true })
	key: string

	@ApiPropertyOptional({ description: '媒体源存在阿里云视频点播的文件名' })
	@IsOptional({}, { string: true, number: true })
	name: string

	@ApiPropertyOptional({ description: '媒体源存在阿里云视频点播的文件地址' })
	@IsOptional({}, { string: true, number: true })
	path: string

	@ApiProperty({ description: '媒体封面' })
	@IsNotEmpty({ message: '媒体标题 必填' })
	cover: string

	@ApiPropertyOptional({ description: '媒体状态: 0.禁用 1.启用 2.删除', enum: [0, 1, 2] })
	@IsOptional({}, { string: true })
	@Type(type => Number)
	status: number

	@ApiPropertyOptional({ description: '排序号' })
	@IsOptional({}, { string: true })
	@Type(type => Number)
	order: number

	@ApiPropertyOptional({ description: '媒体描述' })
	@IsOptional({}, { string: true, number: true })
	description: string

	@ApiPropertyOptional({ description: '类型为多集媒体的父类id' })
	@IsOptional({}, { string: true, number: true })
	parent: number

	@ApiProperty({ description: '分页', example: 1 })
	@IsNotEmpty({ message: 'page 必填' })
	@IsNumber({}, { message: 'page必须是数字' })
	@Min(1, { message: 'page不能小于1' })
	@Type(type => Number)
	page: number

	@ApiProperty({ description: '分页数量', example: 10 })
	@IsNotEmpty({ message: 'size 必填' })
	@IsNumber({}, { message: 'size必须是数字' })
	@Min(1, { message: 'size不能小于1' })
	@Type(type => Number)
	size: number
}
