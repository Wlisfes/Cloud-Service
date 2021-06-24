import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common'
import { Nodemailer, NODEMAILER, NODEMAILER_CONFIG, Config } from './nodemailer.provider'

class NodemailerBase {
	protected client: Nodemailer
	protected options: Config
}

@Injectable()
export class NodemailerService extends NodemailerBase {
	constructor(
		@Inject(NODEMAILER_CONFIG) public readonly options: Config,
		@Inject(NODEMAILER) public readonly client: Nodemailer
	) {
		super()
	}

	//发送验证码
	sendEmailCode() {
		return new Promise((resolve, reject) => {
			this.client.sendMail(
				{
					from: '"Fred Foo 👻" <limvcfast@gmail.com>',
					to: 'limvcfast@gmail.com',
					subject: '邮件标题',
					text: '您的验证码是：3633'
				},
				(error, data) => {
					console.log(error)
					if (error) {
						reject(new HttpException('发送失败', HttpStatus.BAD_REQUEST))
					} else {
						resolve('发送成功')
					}
				}
			)
		})
	}
}
