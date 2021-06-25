import { Controller, Session, Post, Get, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse } from '@nestjs/swagger'
import { NodemailerService } from './nodemailer.service'
import * as DTO from './nodemailer.interface'

@ApiTags('邮件模块')
@Controller('nodemailer')
export class NodemailerController {
	constructor(private readonly nodemailerService: NodemailerService) {}

	@ApiOperation({ summary: '发送注册验证码' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: DTO.NodemailerResponse })
	@Post('register-code')
	async registerCode(@Body() body: DTO.RegisterCode, @Session() session): Promise<DTO.NodemailerResponse> {
		return await this.nodemailerService.registerCode(body, session)
	}
}
