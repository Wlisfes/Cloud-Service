import { Module, Global, DynamicModule } from '@nestjs/common'
import { NODEMAILER_CONFIG, Config, nodemailerProvider } from './nodemailer.provider'
import { NodemailerService } from './nodemailer.service'
import { NodemailerController } from './nodemailer.controller'

@Global()
@Module({
	controllers: [NodemailerController]
})
export class NodemailerModule {
	public static forRoot(options: Config): DynamicModule {
		return {
			module: NodemailerModule,
			providers: [nodemailerProvider(), { provide: NODEMAILER_CONFIG, useValue: options }, NodemailerService],
			exports: [NodemailerService]
		}
	}
}
