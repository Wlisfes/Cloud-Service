import { Controller, Post, Get, Put, Delete, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { PartnerService } from './partner.service'
import { AuthToken, AuthRole, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './partner.interface'

@ApiTags('监控管理-更新日志模块')
@Controller('partner')
export class PartnerController {
	constructor(private readonly partnerService: PartnerService) {}

	@ApiOperation({ summary: '创建更新日志-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin'], module: 'partner', action: 'create' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeCreatePartnerResponse })
	@Post('create')
	async nodeCreatePartner(@Body() body: DTO.NodeCreatePartnerParameter) {
		return await this.partnerService.nodeCreatePartner(body)
	}

	@ApiOperation({ summary: '修改日志-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin'], module: 'partner', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeUpdatePartnerResponse })
	@Put('update')
	async nodeUpdatePartner(@Body() body: DTO.NodeUpdatePartnerParameter) {
		return await this.partnerService.nodeUpdatePartner(body)
	}

	@ApiOperation({ summary: '切换日志状态-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin'], module: 'partner', action: 'update' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodePartnerCutoverResponse })
	@Put('cutover')
	async nodePartnerCutover(@Body() body: DTO.NodePartnerCutoverParameter) {
		return await this.partnerService.nodePartnerCutover(body)
	}

	@ApiOperation({ summary: '日志信息-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin'], module: 'partner', action: 'params' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodePartnerResponse })
	@Get('info')
	async nodePartner(@Query() query: DTO.NodePartnerParameter) {
		return await this.partnerService.nodePartner(query)
	}

	@ApiOperation({ summary: '日志列表-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin'], module: 'partner', action: 'list' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodePartnersResponse })
	@Get('list-node')
	async nodePartners(@Query() query: DTO.NodePartnersParameter) {
		return await this.partnerService.nodePartners(query)
	}

	@ApiOperation({ summary: '删除日志-授权管理端' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@AuthRole({ role: ['admin'], module: 'partner', action: 'delete' })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeDeletePartnerResponse })
	@Delete('del')
	async nodeDeletePartner(@Query() query: DTO.NodeDeletePartnerParameter) {
		return await this.partnerService.nodeDeletePartner(query)
	}
}
