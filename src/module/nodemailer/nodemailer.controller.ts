import { Controller, Post, Get, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse } from '@nestjs/swagger'
import { NodemailerService } from './nodemailer.service'

@ApiTags('邮件模块')
@Controller('nodemailer')
export class NodemailerController {
	constructor(private readonly nodemailerService: NodemailerService) {}

	@ApiOperation({ summary: '发送验证码' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK' })
	@Post('send/code')
	async sendEmailCode(@Body() body) {
		return await this.nodemailerService.sendEmailCode()
	}
}
