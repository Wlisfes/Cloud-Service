import { ApiProperty, ApiPropertyOptional, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsHexColor, IsNumber, Min, Allow } from 'class-validator'
import { IsOptional } from '@/decorator/common.decorator'
import { Type, Transform } from 'class-transformer'
import { toArrayNumber } from '@/utils/validate'
import { NodeCloudSourceResponse } from '@/module/cloud-source/cloud-source.interface'

export class ModuleResponse {
	@ApiProperty({ description: '主键id', example: 1 })
	id: number

	@ApiProperty({ description: '唯一标识', example: 'module' })
	primary: string

	@ApiProperty({ description: '名称', example: '模块权限' })
	name: string

	@ApiProperty({ description: '备注' })
	comment: string

	@ApiProperty({ description: '状态: 0.禁用 1.启用', enum: [0, 1], example: 1 })
	status: number
}

export class ModuleParameter {
	@ApiProperty({ description: '主键id', example: 1 })
	@IsNotEmpty({ message: '主键id 必填' })
	@Type(type => Number)
	id: number

	@ApiProperty({ description: '唯一标识', example: 'module' })
	@IsNotEmpty({ message: '唯一标识 必填' })
	primary: string

	@ApiProperty({ description: '名称', example: '模块权限' })
	@IsNotEmpty({ message: '名称 必填' })
	name: string

	@ApiPropertyOptional({ description: '备注' })
	@IsOptional({}, { string: true, number: true })
	comment: string

	@ApiPropertyOptional({ description: '状态: 0.禁用 1.启用', enum: [0, 1], example: 1 })
	@IsOptional({}, { string: true })
	@Type(type => Number)
	status: number

	@ApiPropertyOptional({ description: '接口权限id', type: [Number], example: [] })
	@IsOptional({}, { string: true, number: true })
	@Transform(type => toArrayNumber(type), { toClassOnly: true })
	@IsNumber({}, { each: true, message: '接口权限id 必须为Array<number>' })
	action: number[]
}

/**
 *
 *
 *创建模块-Parameter
 *************************************************************************************************/
export class NodeCreateModuleParameter extends IntersectionType(
	PickType(ModuleParameter, ['name', 'primary']),
	PickType(ModuleParameter, ['status', 'comment', 'action'])
) {}
/**创建模块-Response**/
export class NodeCreateModuleResponse {
	@ApiProperty({ description: 'message', example: '创建成功' })
	message: string
}

/**
 *
 *
 *修改模块-Parameter
 *************************************************************************************************/
export class NodeUpdateModuleParameter extends IntersectionType(
	PickType(ModuleParameter, ['id', 'name', 'primary']),
	PickType(ModuleParameter, ['status', 'comment', 'action'])
) {}
/**修改模块-Response**/
export class NodeUpdateModuleResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**
 *
 *
 *接口权限信息-Parameter
 *************************************************************************************************/
export class NodeModuleParameter extends PickType(ModuleParameter, ['id']) {}
/**接口权限信息-Response**/
export class NodeModuleResponse extends ModuleResponse {
	@ApiProperty({ description: '接口权限列表', type: [ModuleResponse], example: [] })
	action: ModuleResponse[]
}

/**
 *
 *
 *创建接口权限-Parameter
 *************************************************************************************************/
export class NodeCreateModuleActionParameter extends IntersectionType(
	PickType(ModuleParameter, ['name', 'primary']),
	PickType(ModuleParameter, ['status', 'comment'])
) {}
/**创建接口权限-Response**/
export class NodeCreateModuleActionResponse {
	@ApiProperty({ description: 'message', example: '创建成功' })
	message: string
}

/**
 *
 *
 *修改接口权限-Parameter
 *************************************************************************************************/
export class NodeUpdateModuleActionParameter extends IntersectionType(
	PickType(ModuleParameter, ['id', 'name', 'primary']),
	PickType(ModuleParameter, ['status', 'comment'])
) {}
/**修改接口权限-Response**/
export class NodeUpdateModuleActionResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}
/**
 *
 *
 *接口权限信息-Parameter
 *************************************************************************************************/
export class NodeModuleActionParameter extends PickType(ModuleParameter, ['id']) {}
/**接口权限信息-Response**/
export class NodeModuleActionResponse extends ModuleResponse {}
