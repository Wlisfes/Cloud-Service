import { ApiProperty, ApiPropertyOptional, PickType, OmitType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsEmail, Length, IsNumber, Min } from 'class-validator'
import { IsOptional, IsMobile } from '@/decorator/common.decorator'
import { Type, Transform } from 'class-transformer'
import { toArrayNumber } from '@/utils/validate'
import { JwtInterface } from '@/module/jwt/jwt.interface'

export class UserInterface {
	@ApiPropertyOptional({ description: '主键id', example: 1 })
	id: number

	@ApiPropertyOptional({ description: 'uid', example: 1624521523438 })
	uid: number

	@ApiPropertyOptional({ description: '账户', example: 88888888 })
	account: number

	@ApiPropertyOptional({ description: '昵称', example: '妖雨纯' })
	nickname: string

	@ApiPropertyOptional({ description: '邮箱', example: '876451336@qq.com' })
	@IsOptional({}, { string: true })
	@IsEmail({}, { message: '邮箱格式 错误' })
	email: string

	@ApiPropertyOptional({ description: '密码', example: '****************' })
	@IsOptional({}, { string: true })
	@Length(6, 16, { message: '密码长度必须6~16位' })
	password: string | null

	@ApiPropertyOptional({ description: '头像', example: 'https://oss.lisfes.cn/xxx/xxx.png' })
	@IsOptional({}, { string: true })
	avatar: string | null

	@ApiPropertyOptional({ description: '手机号', example: 18888888888 })
	@IsOptional({}, { string: true, number: true })
	@IsMobile({ message: '手机号格式 错误' })
	mobile: number | null

	@ApiPropertyOptional({ description: '状态', enum: [0, 1], example: 0 | 1 })
	status: 1 | 0

	@ApiPropertyOptional({ description: '总数', example: 0 })
	total: number

	@ApiPropertyOptional({ description: '备注', example: '备注' })
	@IsOptional({}, { string: true })
	comment: string
}

class UserParameter {
	@ApiProperty({ description: 'uid', example: 1624521523438 })
	@IsNotEmpty({ message: 'uid 必填' })
	@Type(type => Number)
	uid: number

	@ApiProperty({ description: '邮箱验证码', example: 599348 })
	@IsNotEmpty({ message: '邮箱验证码 必填' })
	@Type(type => Number)
	code: number

	@ApiProperty({ description: '账户', example: 88888888 })
	@IsNotEmpty({ message: '账户 必填' })
	// @Type(type => Number)
	account: number

	@ApiProperty({ description: '昵称', example: '妖雨纯' })
	@IsNotEmpty({ message: '昵称 必填' })
	nickname: string

	@ApiProperty({ description: '邮箱', example: '876451336@qq.com' })
	@IsNotEmpty({ message: '邮箱 必填' })
	@IsEmail({}, { message: '邮箱格式 错误' })
	email: string

	@ApiProperty({ description: '密码', example: '888888' })
	@IsNotEmpty({ message: '密码 必填' })
	@Length(6, 16, { message: '密码长度必须6~16位' })
	password: string

	@ApiProperty({ description: '头像', example: 'https://oss.lisfes.cn/xxx/xxx.png' })
	@IsNotEmpty({ message: '头像 必填' })
	avatar: string

	@ApiProperty({ description: '状态', enum: [0, 1], example: 0 | 1 })
	@IsNotEmpty({ message: '状态 必填' })
	@Type(type => Number)
	status: 1 | 0

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

	@ApiPropertyOptional({ description: '角色id', type: [Number], example: [] })
	@IsOptional({}, { string: true, number: true })
	@Transform(type => toArrayNumber(type), { toClassOnly: true })
	@IsNumber({}, { each: true, message: '角色id 必须为Array<number>' })
	role: number[]
}

export class CreateCode {
	@ApiProperty({ description: 'text', example: 3045 })
	text: string
	@ApiProperty({ description: 'text', example: 3045 })
	data: string
}

/**注册用户-Parameter******************************************************************************/
export class RegisterUserParameter extends PickType(UserParameter, ['nickname', 'password', 'email', 'code']) {}
/**注册用户-Response**/
export class RegisterUserResponse {
	@ApiProperty({ description: 'message', example: '注册成功' })
	message: string
}

/**创建用户-Parameter******************************************************************************/
export class CreateUserParameter extends IntersectionType(
	PickType(UserParameter, ['nickname', 'password', 'status', 'role']),
	PickType(UserInterface, ['avatar', 'email', 'mobile', 'comment'])
) {}
/**创建用户-Response**/
export class CreateUserResponse {
	@ApiProperty({ description: 'message', example: '创建成功' })
	message: string
}

/**用户登录-Parameter******************************************************************************/
export class LoginUserParameter extends PickType(UserParameter, ['account', 'password']) {
	@ApiProperty({ description: '验证码', example: 'hj56' })
	@IsNotEmpty({ message: '验证码 必填' })
	@Type(type => String)
	code: string
}
/**用户登录-Response**/
export class LoginUserResponse extends PickType(JwtInterface, ['token']) {}

/**用户信息-Parameter******************************************************************************/
export class NodeUidUserParameter extends PickType(UserParameter, ['uid']) {}
/**用户信息-Response**/
export class NodeUserResponse extends OmitType(UserInterface, ['total']) {}

/**用户列表-Parameter******************************************************************************/
export class NodeUsersParameter extends PickType(UserParameter, ['page', 'size']) {
	@ApiPropertyOptional({ description: '用户状态：0.已禁用 1.已启用', enum: [0, 1] })
	@IsOptional({}, { string: true, number: true })
	@Type(type => Number)
	status: number

	@ApiPropertyOptional({ description: '角色标识' })
	@IsOptional({}, { string: true, number: true })
	primary: string

	@ApiPropertyOptional({ description: '关键字' })
	@IsOptional({}, { string: true })
	keyword: string
}
/**用户列表-Response**/
export class NodeUsersResponse extends PickType(UserInterface, ['total']) {
	@ApiProperty({ description: '用户列表', type: [OmitType(UserInterface, ['total'])], example: [] })
	list: UserInterface[]
}

/**修改用户信息-Parameter******************************************************************************/
export class NodeUpdateUserParameter extends IntersectionType(
	PickType(UserParameter, ['uid', 'role', 'nickname', 'status']),
	PickType(UserInterface, ['avatar', 'email', 'mobile', 'comment'])
) {}
/**修改用户信息-Response**/
export class NodeUpdateUserResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**修改用户密码-Parameter******************************************************************************/
export class NodeUpdatePwsUserParameter extends PickType(UserParameter, ['uid', 'password']) {}
/**修改用户密码-Response**/
export class NodeUpdatePwsUserResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}

/**修改用户邮箱-Parameter******************************************************************************/
export class NodeUpdateUserEmailParameter extends PickType(UserParameter, ['email', 'code']) {}
/**修改用户邮箱-Response**/
export class NodeUpdateUserEmailResponse extends OmitType(UserInterface, ['total']) {}

/**切换用户状态-Parameter***********************************************************************/
export class NodeUserCutoverParameter extends PickType(UserParameter, ['uid']) {}
/**切换用户状态-Response**/
export class NodeUserCutoverResponse {
	@ApiProperty({ description: 'message', example: '修改成功' })
	message: string
}
