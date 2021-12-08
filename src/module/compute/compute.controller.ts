import { Controller, Post, Get, Put, Delete, Body, Query, Req } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiConsumes, ApiProduces, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { ComputeService } from './compute.service'
import { AuthToken, APP_AUTH_TOKEN } from '@/guard/auth.guard'
import * as DTO from './compute.interface'

@ApiTags('统计模块')
@Controller('compute')
export class ComputeController {
	constructor(private readonly computeService: ComputeService) {}

	@ApiOperation({ summary: '统计模块-各类总数统计' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiConsumes('application/x-www-form-urlencoded', 'application/json')
	@ApiProduces('application/json', 'application/xml')
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeComputeTotalResponse })
	@Get('total')
	async nodeComputeTotal() {
		return await this.computeService.nodeComputeTotal()
	}
}
