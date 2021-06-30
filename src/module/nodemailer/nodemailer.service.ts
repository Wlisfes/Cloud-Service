import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common'
import { Nodemailer, NODEMAILER, NODEMAILER_CONFIG, Config, SendMailOption } from './nodemailer.provider'
import { RedisService } from '@/module/redis/redis.service'
import * as DTO from './nodemailer.interface'

@Injectable()
export class NodemailerService {
	constructor(
		@Inject(NODEMAILER_CONFIG) public readonly options: Config,
		@Inject(NODEMAILER) public readonly client: Nodemailer,
		private readonly redisService: RedisService
	) {}

	//创建数字验证码
	public async createNumberCode(num: number): Promise<number> {
		const captcha = Array(num)
			.fill(num)
			.map(() => Math.floor(Math.random() * 10))
			.join('')
		return Number(captcha)
	}

	//发送邮箱验证码
	private sendEmailCode(props: SendMailOption): Promise<DTO.NodemailerResponse> {
		return new Promise((resolve, reject) => {
			this.client.sendMail(props, (error, data) => {
				if (error) {
					reject(new HttpException('发送失败', HttpStatus.BAD_REQUEST))
				} else {
					resolve({ code: 200, messsage: '发送成功' })
				}
			})
		})
	}

	//发送注册验证码
	async registerCode(props: DTO.RegisterCode): Promise<DTO.NodemailerResponse> {
		try {
			const code = await this.createNumberCode(6)
			await this.redisService.setStore(props.email, code, 1800)
			return await this.sendEmailCode({
				from: '"妖雨纯" <876451336@qq.com>',
				to: props.email,
				subject: '温馨提示',
				html: `欢迎注册lisfes.cn, 您的验证码是: <b>${code}</b> 有效时间30分钟`
			})
		} catch (e) {
			throw new HttpException(e.message || e.toString(), HttpStatus.BAD_REQUEST)
		}
	}
}
