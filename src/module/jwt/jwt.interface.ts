import { ApiProperty, PickType } from '@nestjs/swagger'

export class JwtInterface {
	@ApiProperty({ description: 'uid', example: 1624636180841 })
	uid: number
	@ApiProperty({ description: '密码', example: '****************' })
	password: string
	@ApiProperty({ description: 'token', example: '****************' })
	token: string
}

export class Signature extends PickType(JwtInterface, ['uid', 'password']) {}
export class SignatureRespoens extends PickType(JwtInterface, ['token']) {}
export class SignverifyRespoens extends PickType(JwtInterface, ['uid', 'password']) {}
