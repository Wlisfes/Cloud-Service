import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsNotEmpty, IsEmail, Length } from 'class-validator'
import { Type } from 'class-transformer'

class UserInterface {
	@ApiProperty({ description: '主键id', example: 1 })
	id: number
	@ApiProperty({ description: 'uid', example: 1624521523438 })
	uid: number
	@ApiProperty({ description: '用户名', example: 'lisfes' })
	username: string
	@ApiProperty({ description: '昵称', example: '妖雨纯' })
	nickname: string
	@ApiProperty({ description: '邮箱', example: '876451336@qq.com' })
	email: string
	@ApiProperty({ description: '密码', example: '****************' })
	password: string | null
	@ApiProperty({ description: '头像', example: 'https://oss.lisfes.cn/xxx/xxx.png' })
	avatar: string | null
	@ApiProperty({ description: '手机号', example: 18888888888 })
	mobile: number | null
	@ApiProperty({ description: '状态', example: 0 | 1 })
	status: number
}

class UserParameter {
	@ApiProperty({ description: 'uid', example: 1624521523438 })
	@IsNotEmpty({ message: 'uid 必填' })
	@Length(13, 13, { message: 'uid 格式错误' })
	@Type(type => Number)
	uid: number

	@ApiProperty({ description: '验证码', example: 599348 })
	@IsNotEmpty({ message: '验证码 必填' })
	@Type(type => Number)
	code: number

	@ApiProperty({ description: '用户名', example: 'lisfes' })
	@IsNotEmpty({ message: '用户名 必填' })
	@Length(4, 20, { message: '用户名长度必须4~20位' })
	username: string

	@ApiProperty({ description: '昵称', example: '妖雨纯' })
	@IsNotEmpty({ message: '昵称 必填' })
	nickname: string

	@ApiProperty({ description: '邮箱', example: '876451336@qq.com' })
	@IsNotEmpty({ message: '邮箱 必填' })
	@IsEmail()
	email: string

	@ApiProperty({ description: '密码', example: '888888' })
	@IsNotEmpty({ message: '密码 必填' })
	@Length(6, 16, { message: '密码长度必须6~16位' })
	password: string

	@ApiProperty({ description: '头像', example: 'https://oss.lisfes.cn/xxx/xxx.png' })
	@IsNotEmpty({ message: '头像 必填' })
	avatar: string
}

export class CreateUser extends PickType(UserParameter, ['username', 'nickname', 'password', 'email', 'code']) {}
export class UserCreateUserResponse extends UserInterface {}

export class LoginUser extends PickType(UserParameter, ['username', 'password']) {}
