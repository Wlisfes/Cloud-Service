import { Controller, Get, Query } from '@nestjs/common'
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
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeComputeTotalResponse })
	@Get('total')
	async nodeComputeTotal() {
		return await this.computeService.nodeComputeTotal()
	}

	@ApiOperation({ summary: '统计模块-各类分组统计' })
	@ApiBearerAuth(APP_AUTH_TOKEN)
	@AuthToken({ login: true })
	@ApiResponse({ status: 200, description: 'OK', type: () => DTO.NodeComputeGroupResponse })
	@Get('group')
	async nodeComputeGroup(@Query() query: DTO.NodeComputeGroupParameter) {
		return await this.computeService.nodeComputeGroup(query)
	}
}
