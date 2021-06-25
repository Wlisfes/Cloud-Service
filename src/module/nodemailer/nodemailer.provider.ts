const nodemailer = require('nodemailer')

export const NODEMAILER = Symbol('NODEMAILER')
export const NODEMAILER_CONFIG = Symbol('NODEMAILER_CONFIG')

interface Auth {
	user: string
	pass: string
}
export interface Config {
	host: string
	secure: boolean
	auth: Auth
}
export interface SendMailOption {
	from: string
	to: string
	subject: string
	text?: string
	html?: string
}

export declare class Nodemailer {
	constructor(config: Config)

	sendMail(option: SendMailOption, callback: (err: Error | null, success: true) => void)
}

export const nodemailerProvider = () => ({
	provide: NODEMAILER,
	useFactory: (options: Config): Nodemailer => {
		return new nodemailer.createTransport({
			host: options.host,
			secure: options.secure,
			auth: {
				user: options.auth.user,
				pass: options.auth.pass
			}
		})
	},
	inject: [NODEMAILER_CONFIG]
})
