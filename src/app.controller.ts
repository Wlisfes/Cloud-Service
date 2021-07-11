import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('根模块')
@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return 'Hello World!'
	}
}
