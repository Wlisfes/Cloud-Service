import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsNotEmpty, IsEmail } from 'class-validator'
import { Type } from 'class-transformer'

class NodemailerInterface {
	@ApiProperty({ description: '状态码', example: 200 })
	code: number
	@ApiProperty({ description: '状态描述', example: '发送成功' })
	message: string
}

class NodemailerParameter {
	@ApiProperty({ description: '邮箱', example: 'limvcfast@gmail.com' })
	@IsNotEmpty({ message: '邮箱 必填' })
	@IsEmail()
	email: string
}

export class RegisterCode extends PickType(NodemailerParameter, ['email']) {}
export class NodemailerResponse extends PickType(NodemailerInterface, ['message', 'code']) {}
