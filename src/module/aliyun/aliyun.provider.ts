const Client = require('@alicloud/pop-core').RPCClient
import * as OSS from 'ali-oss'

/**视频点播************************************/
export const CLIENT = Symbol('CLIENT')
export const CLIENT_CONFIG = Symbol('CLIENT_CONFIG')
export interface Config {
	endpoint: string
	apiVersion: string
	accessKeyId: string
	accessKeySecret: string
	codes?: (string | number)[]
	opts?: object
}

export declare class RPCClient {
	constructor(config: Config)

	request<T>(action: String, params: Object, options?: Object): Promise<T>
}

/**视频点播Service**/
export const aliyunProvider = () => ({
	provide: CLIENT,
	useFactory: (options: Config): RPCClient => {
		return new Client(options)
	},
	inject: [CLIENT_CONFIG]
})

/**OSS************************************/
export const OSS_CONST = Symbol('OSS')
export const OSS_STS_CONST = Symbol('OSS')
export const OSS_OPTIONS = Symbol('OSS_OPTIONS')

export interface OSSOptions {
	client: OSS.Options
	roleArn: string
	sessionName: string
	domain?: string
}

/**OSS存储Service**/
export const ossProvider = () => ({
	provide: OSS_CONST,
	useFactory: (options: OSSOptions) => {
		return new OSS(options.client)
	},
	inject: [OSS_OPTIONS]
})

/**STS授权Service**/
export const stsProvider = () => ({
	provide: OSS_STS_CONST,
	useFactory: (options: OSSOptions) => {
		return new OSS.STS({
			accessKeyId: options.client.accessKeyId,
			accessKeySecret: options.client.accessKeySecret
		})
	},
	inject: [OSS_OPTIONS]
})
