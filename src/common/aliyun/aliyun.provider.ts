const Client = require('@alicloud/pop-core').RPCClient

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

export const aliyunProvider = () => ({
	provide: CLIENT,
	useFactory: (options: Config): RPCClient => {
		return new Client(options)
	},
	inject: [CLIENT_CONFIG]
})
